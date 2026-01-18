"use client";

import React, { ReactNode } from "react";
import {
  ComponentConfig,
  DefaultComponentProps,
} from "@measured/puck";
import { useDataScope, DataScopeProvider, DataScope, resolveBindings, hasBindings } from "@/lib/data-binding";
import { getMockData } from "@/lib/data-binding/payload-data-source";

/**
 * Props for components that support data payload hints and iteration
 */
export type WithDataPayloadHint<Props extends DefaultComponentProps> = Props & {
  loopData?: boolean;
  maxItems?: number;
};

/**
 * Helper to detect if value is an array
 */
function isArrayData(data: unknown): data is unknown[] {
  return Array.isArray(data);
}

/**
 * Component wrapper that handles data iteration for child components
 * and resolves bindings within the correct scope for each iteration
 */
const DataIterationWrapper: React.FC<{
  loopData: boolean;
  maxItems: number;
  isEditing: boolean;
  children: (scope: DataScope) => ReactNode;
  scope: DataScope;
}> = ({ loopData, maxItems, isEditing, children, scope }) => {
  // If loopData is not enabled, just render children with current scope
  if (!loopData) {
    return <>{children(scope)}</>;
  }

  // Find array data in the scope to loop over
  const arrayEntry = Object.entries(scope).find(([key, value]) => 
    isArrayData(value) && key !== 'index'
  );

  if (!arrayEntry) {
    // No array data found, render children as-is
    return <>{children(scope)}</>;
  }

  const [variableName, arrayData] = arrayEntry;
  
  // Type assertion since we know it's an array from isArrayData check
  const dataArray = arrayData as unknown[];
  
  // In edit mode, only show the first item as preview
  if (isEditing) {
    const previewItem = dataArray[0];
    const variables: DataScope = {
      ...scope,
      [variableName]: previewItem,
      index: 0,
    };

    return (
      <DataScopeProvider variables={variables}>
        {children(variables)}
      </DataScopeProvider>
    );
  }

  // In render mode, render all items (respecting maxItems)
  const itemsToRender = maxItems > 0 ? dataArray.slice(0, maxItems) : dataArray;

  return (
    <>
      {itemsToRender.map((item, index) => {
        const variables: DataScope = {
          ...scope,
          [variableName]: item,
          index,
        };

        return (
          <DataScopeProvider key={index} variables={variables}>
            {children(variables)}
          </DataScopeProvider>
        );
      })}
    </>
  );
};

/**
 * HOC that adds data payload hint field and iteration control to a component.
 * This shows users what data is available from parent layout components and
 * allows them to enable looping through array data with a checkbox.
 * 
 * The hint field is displayed in the editor sidebar when the component is selected,
 * showing the current data scope in JSON format with usage examples.
 * 
 * When the "Loop through data" checkbox is enabled, the component will be repeated
 * for each item in any array found in the data scope.
 * 
 * @example
 * ```tsx
 * const Card = withDataPayloadHint(CardInternal);
 * ```
 */
export function withDataPayloadHint<
  ThisComponentConfig extends ComponentConfig<any> = ComponentConfig
>(componentConfig: ThisComponentConfig): ThisComponentConfig {
  const originalRender = componentConfig.render;

  return {
    ...componentConfig,
    fields: {
      // Add iteration control fields
      loopData: {
        type: "radio",
        label: "Loop through data",
        options: [
          { label: "Yes", value: true },
          { label: "No", value: false },
        ],
      },
      maxItems: {
        type: "number",
        label: "Max Items (0 = unlimited)",
        min: 0,
      },
      // Spread existing fields
      ...componentConfig.fields,
    },
    defaultProps: {
      ...componentConfig.defaultProps,
      loopData: false,
      maxItems: 0,
    },
    resolveFields: (data, params) => {
      // Get parent's data configuration if available
      let parentData: any = null;
      let parentDataSource = "";
      let parentVariableName = "";
      
      if (params.parent?.props?.data) {
        parentData = params.parent.props.data;
        parentDataSource = parentData.source || "";
        parentVariableName = parentData.as || "";
      }

      // Build the hint message
      let hintContent = "";
      if (parentDataSource && parentVariableName) {
        // Show what data is available
        const exampleData = getMockData(parentDataSource);
        if (exampleData) {
          const dataPreview = Array.isArray(exampleData) ? exampleData[0] : exampleData;
          hintContent = `Data from parent: "${parentVariableName}" from "${parentDataSource}"\n\nExample:\n${JSON.stringify(dataPreview, null, 2)}\n\nUse: {{${parentVariableName}.property}}`;
        }
      } else {
        hintContent = "No data available. Add this component inside a Flex or Grid component with data binding configured.";
      }

      // Original fields
      const baseFields = componentConfig.resolveFields 
        ? componentConfig.resolveFields(data, params)
        : componentConfig.fields;

      return {
        _dataPayloadHint: {
          type: "custom",
          label: "Available Data",
          render: () => (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md mb-4">
              <h4 className="text-sm font-semibold text-blue-700 mb-2">Available Data Payload</h4>
              <pre className="text-xs bg-white p-2 rounded border border-blue-100 overflow-auto max-h-48 whitespace-pre-wrap">
                {hintContent}
              </pre>
            </div>
          ),
        },
        loopData: {
          type: "radio",
          label: "Loop through data",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        maxItems: {
          type: "number",
          label: "Max Items (0 = unlimited)",
          min: 0,
        },
        ...baseFields,
      };
    },
    render: (props) => {
      // Get the current data scope from context
      const { scope } = useDataScope();
      
      const isEditing = props.puck?.isEditing ?? false;
      const loopData = props.loopData ?? false;
      const maxItems = props.maxItems ?? 0;

      // Use useCallback to create a stable reference for the render function
      // We pass the props object as a dependency directly - React will do a shallow comparison
      const renderWithResolvedBindings = React.useCallback((iterationScope: DataScope) => {
        // Resolve bindings in props (excluding puck, id, and our iteration control props)
        const { puck, id, loopData: _loopData, maxItems: _maxItems, ...dataProps } = props;
          
          // Create resolve function from scope
          const resolve = (template: string) => resolveBindings(template, iterationScope);
          
          // Recursively resolve bindings in all props
          const resolvePropsBindings = (obj: Record<string, unknown>): Record<string, unknown> => {
            const resolved: Record<string, unknown> = {};
            
            for (const [key, value] of Object.entries(obj)) {
              if (typeof value === "string" && hasBindings(value)) {
                resolved[key] = resolve(value);
              } else if (value && typeof value === "object" && !React.isValidElement(value)) {
                if (Array.isArray(value)) {
                  resolved[key] = value.map((item) => {
                    if (typeof item === "string" && hasBindings(item)) {
                      return resolve(item);
                    }
                    if (item && typeof item === "object" && !React.isValidElement(item)) {
                      return resolvePropsBindings(item as Record<string, unknown>);
                    }
                    return item;
                  });
                } else {
                  resolved[key] = resolvePropsBindings(value as Record<string, unknown>);
                }
              } else {
                resolved[key] = value;
              }
            }
            
            return resolved;
          };
          
          const resolvedDataProps = resolvePropsBindings(dataProps);
          
          // Render the original component with resolved props
          return originalRender({ ...resolvedDataProps, puck, id });
        }, [props]);

      return (
        <DataIterationWrapper
          loopData={loopData}
          maxItems={maxItems}
          isEditing={isEditing}
          scope={scope}
        >
          {renderWithResolvedBindings}
        </DataIterationWrapper>
      );
    },
  };
}
