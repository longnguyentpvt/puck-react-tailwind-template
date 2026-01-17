"use client";

import React, { ReactNode } from "react";
import {
  ComponentConfig,
  DefaultComponentProps,
  CustomField,
} from "@measured/puck";
import { useDataScope, DataScopeProvider, DataScope, getValueByPath } from "@/lib/data-binding";

/**
 * Props for components that support data payload hints and iteration
 */
export type WithDataPayloadHint<Props extends DefaultComponentProps> = Props & {
  loopData?: boolean;
  maxItems?: number;
};

/**
 * Custom field component that displays the current data scope payload as JSON
 * This helps users understand what data is available from parent components
 * 
 * @param _name - Required by CustomField interface but not used in this display-only component
 */
const DataPayloadHintField: React.FC<{ name: string }> = ({ name: _name }) => {
  const { scope } = useDataScope();
  
  // Filter out empty or undefined values from scope
  const filteredScope = Object.entries(scope).reduce((acc, [key, val]) => {
    if (val !== undefined && val !== null && val !== "") {
      acc[key] = val;
    }
    return acc;
  }, {} as Record<string, any>);
  
  const hasData = Object.keys(filteredScope).length > 0;
  
  if (!hasData) {
    return (
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Available Data Payload</h4>
        <p className="text-xs text-gray-500 italic">
          No data available. Add this component inside a Flex or Grid component with data binding configured.
        </p>
      </div>
    );
  }
  
  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
      <h4 className="text-sm font-semibold text-blue-700 mb-2">Available Data Payload</h4>
      <p className="text-xs text-gray-600 mb-2">
        You can use the following data in any text field using the syntax: <code className="bg-white px-1 py-0.5 rounded">{"{{variableName.property}}"}</code>
      </p>
      <pre className="text-xs bg-white p-2 rounded border border-blue-100 overflow-auto max-h-48">
        {JSON.stringify(filteredScope, null, 2)}
      </pre>
      <p className="text-xs text-gray-500 mt-2 italic">
        Example: <code className="bg-white px-1 py-0.5 rounded">{"{{item.name}}"}</code> or <code className="bg-white px-1 py-0.5 rounded">{"{{item.price}}"}</code>
      </p>
    </div>
  );
};

/**
 * Custom field definition for data payload hint
 */
const dataPayloadHintField: CustomField<any> = {
  type: "custom",
  label: "",
  render: ({ name }) => <DataPayloadHintField name={name} />,
};

/**
 * Mock external data for demonstration
 * In production, this would come from externalData passed via Puck
 */
const mockExternalData = {
  products: [
    { id: 1, name: "Product 1", price: 99.99, image: "https://picsum.photos/seed/p1/400/300" },
    { id: 2, name: "Product 2", price: 149.99, image: "https://picsum.photos/seed/p2/400/300" },
    { id: 3, name: "Product 3", price: 199.99, image: "https://picsum.photos/seed/p3/400/300" },
    { id: 4, name: "Product 4", price: 249.99, image: "https://picsum.photos/seed/p4/400/300" },
  ],
  user: {
    name: "John Doe",
    email: "john@example.com",
  },
  categories: [
    { id: 1, name: "Electronics", icon: "📱" },
    { id: 2, name: "Clothing", icon: "👕" },
    { id: 3, name: "Home & Garden", icon: "🏠" },
  ],
};

/**
 * Helper to detect if value is an array
 */
function isArrayData(data: unknown): data is unknown[] {
  return Array.isArray(data);
}

/**
 * Component wrapper that handles data iteration for child components
 */
const DataIterationWrapper: React.FC<{
  loopData: boolean;
  maxItems: number;
  isEditing: boolean;
  children: ReactNode;
  scope: DataScope;
}> = ({ loopData, maxItems, isEditing, children, scope }) => {
  // If loopData is not enabled, just render children with current scope
  if (!loopData) {
    return <>{children}</>;
  }

  // Find array data in the scope to loop over
  const arrayEntry = Object.entries(scope).find(([key, value]) => 
    isArrayData(value) && key !== 'index'
  );

  if (!arrayEntry) {
    // No array data found, render children as-is
    return <>{children}</>;
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
        {children}
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
            {children}
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
      // Add the data payload hint field at the top
      _dataPayloadHint: dataPayloadHintField,
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
      // This field is purely for UI display and doesn't hold any data
      _dataPayloadHint: undefined,
      loopData: false,
      maxItems: 0,
    },
    render: (props) => {
      const isEditing = props.puck?.isEditing ?? false;
      const loopData = props.loopData ?? false;
      const maxItems = props.maxItems ?? 0;

      // Get the current data scope from context
      const ScopeConsumer: React.FC<{ children: (scope: DataScope) => ReactNode }> = ({ children }) => {
        const { scope } = useDataScope();
        return <>{children(scope)}</>;
      };

      // Get the original rendered content
      const content = originalRender(props);

      return (
        <ScopeConsumer>
          {(scope) => (
            <DataIterationWrapper
              loopData={loopData}
              maxItems={maxItems}
              isEditing={isEditing}
              scope={scope}
            >
              {content}
            </DataIterationWrapper>
          )}
        </ScopeConsumer>
      );
    },
  };
}
