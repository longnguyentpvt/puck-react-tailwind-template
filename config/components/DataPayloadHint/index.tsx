"use client";

import React, { ReactNode, useState, useEffect } from "react";
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
      // Build hint content based on parent data
      const buildHintContent = () => {
        let hintContent = "";
        
        if (params.parent?.props?.data) {
          const liveParentData = params.parent.props.data;
          const parentSourceType = liveParentData.sourceType || "collection";
          // Use the correct field based on sourceType
          const parentDataSource = parentSourceType === "api" 
            ? liveParentData.apiEndpoint || "" 
            : liveParentData.source || "";
          const parentVariableName = liveParentData.as || "";

          if (parentDataSource && parentVariableName) {
            if (parentSourceType === "collection") {
              // Show collection data
              const exampleData = getMockData(parentDataSource);
              if (exampleData) {
                const dataPreview = Array.isArray(exampleData) ? exampleData[0] : exampleData;
                hintContent = `Data from parent: "${parentVariableName}" from collection "${parentDataSource}"\n\nExample:\n${JSON.stringify(dataPreview, null, 2)}\n\nUse: {{${parentVariableName}.property}}`;
              }
            } else if (parentSourceType === "api") {
              // Show API endpoint info
              hintContent = `Data from parent: "${parentVariableName}" from endpoint "${parentDataSource}"\n\nAPI data will be fetched at runtime.\n\nUse: {{${parentVariableName}.property}}`;
              
              // Try to show response schema if available
              if (liveParentData.apiSource) {
                hintContent += `\n\nAPI Source: ${liveParentData.apiSource}`;
                
                // Try to fetch and parse Swagger spec to show response format
                // This is async, but we'll need to handle this with a useState/useEffect in the render function
                // For now, just indicate that schema will be shown
                hintContent += `\n\nFetching response schema...`;
              }
            }
          } else {
            hintContent = "No data available. Add this component inside a Flex or Grid component with data binding configured.";
          }
        } else {
          hintContent = "No data available. Add this component inside a Flex or Grid component with data binding configured.";
        }

        return hintContent;
      };

      const hintContent = buildHintContent();

      // Original fields
      const baseFields = componentConfig.resolveFields 
        ? componentConfig.resolveFields(data, params)
        : componentConfig.fields;

      return {
        _dataPayloadHint: {
          type: "custom",
          label: "Available Data",
          render: () => {
            const [schemaInfo, setSchemaInfo] = useState<string>("");
            const [isLoadingSchema, setIsLoadingSchema] = useState(false);
            
            useEffect(() => {
              // Fetch schema for API mode
              if (params.parent?.props?.data?.sourceType === "api" && 
                  params.parent?.props?.data?.apiSource && 
                  params.parent?.props?.data?.apiEndpoint) {
                setIsLoadingSchema(true);
                
                const fetchSchema = async () => {
                  try {
                    const apiSource = params.parent.props.data.apiSource;
                    const endpoint = params.parent.props.data.apiEndpoint;
                    
                    // Fetch API source config
                    const configResponse = await fetch(`/api/swagger-specs?id=${apiSource}`);
                    if (!configResponse.ok) {
                      throw new Error('Failed to fetch API config');
                    }
                    const apiConfig = await configResponse.json();
                    
                    // Fetch the Swagger spec
                    const specResponse = await fetch(apiConfig.swaggerUrl);
                    if (!specResponse.ok) {
                      throw new Error('Failed to fetch Swagger spec');
                    }
                    const spec = await specResponse.json();
                    
                    // Find the endpoint and extract response schema
                    const isOpenApi3 = spec.openapi && spec.openapi.startsWith('3.');
                    const paths = spec.paths || {};
                    
                    // Parse endpoint (e.g., "GET /api/users")
                    const [method, ...pathParts] = endpoint.split(' ');
                    const path = pathParts.join(' ');
                    const lowerMethod = method?.toLowerCase();
                    
                    if (paths[path] && paths[path][lowerMethod]) {
                      const operation = paths[path][lowerMethod];
                      const responses = operation.responses || {};
                      const successResponse = responses['200'] || responses['201'] || responses['default'];
                      
                      if (successResponse) {
                        let schema;
                        if (isOpenApi3) {
                          const content = successResponse.content || {};
                          const contentType = Object.keys(content)[0];
                          if (contentType) {
                            schema = content[contentType].schema;
                          }
                        } else {
                          schema = successResponse.schema;
                        }
                        
                        if (schema) {
                          // Format schema for display
                          const formatted = formatSchemaForDisplay(schema, spec, 0);
                          setSchemaInfo(formatted);
                        } else {
                          setSchemaInfo('No response schema defined for this endpoint.');
                        }
                      } else {
                        setSchemaInfo('No successful response defined for this endpoint.');
                      }
                    } else {
                      setSchemaInfo('Endpoint not found in Swagger specification.');
                    }
                  } catch (error) {
                    console.error('Error fetching schema:', error);
                    setSchemaInfo(`Error loading schema: ${error instanceof Error ? error.message : 'Unknown error'}`);
                  } finally {
                    setIsLoadingSchema(false);
                  }
                };
                
                fetchSchema();
              }
            }, [params.parent?.props?.data?.sourceType, params.parent?.props?.data?.apiSource, params.parent?.props?.data?.apiEndpoint]);
            
            // Combine base hint with schema info
            const fullHintContent = hintContent + (schemaInfo ? `\n\n${schemaInfo}` : '');
            const displayContent = isLoadingSchema ? hintContent + '\n\nLoading response schema...' : fullHintContent;
            
            return (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md mb-4">
                <h4 className="text-sm font-semibold text-blue-700 mb-2">Available Data Payload</h4>
                <pre className="text-xs bg-white p-2 rounded border border-blue-100 overflow-auto max-h-96 whitespace-pre-wrap">
                  {displayContent}
                </pre>
              </div>
            );
          },
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

/**
 * Format JSON schema for display
 */
function formatSchemaForDisplay(schema: any, spec: any, depth: number = 0): string {
  if (!schema) return '';
  
  const indent = '  '.repeat(depth);
  const maxDepth = 3;
  
  if (depth > maxDepth) {
    return `${indent}...`;
  }
  
  // Resolve $ref
  if (schema.$ref) {
    const refParts = schema.$ref.split('/');
    let resolved = spec;
    for (const part of refParts) {
      if (part === '#') continue;
      resolved = resolved[part];
    }
    schema = resolved || schema;
  }
  
  // Handle array type
  if (schema.type === 'array') {
    if (schema.items) {
      return `Array<\n${formatSchemaForDisplay(schema.items, spec, depth + 1)}\n${indent}>`;
    }
    return 'Array<any>';
  }
  
  // Handle object type
  if (schema.type === 'object' || schema.properties) {
    const lines: string[] = ['{'];
    const properties = schema.properties || {};
    const required = schema.required || [];
    
    for (const [propName, propSchema] of Object.entries(properties)) {
      const isRequired = required.includes(propName);
      const propType = getSchemaType(propSchema as any, spec);
      lines.push(`${indent}  ${propName}${isRequired ? '' : '?'}: ${propType}`);
    }
    
    lines.push(`${indent}}`);
    return lines.join('\n');
  }
  
  // Handle primitive types
  return schema.type || 'any';
}

/**
 * Get a simple type string from schema
 */
function getSchemaType(schema: any, spec: any): string {
  if (!schema) return 'any';
  
  // Resolve $ref
  if (schema.$ref) {
    const refParts = schema.$ref.split('/');
    let resolved = spec;
    for (const part of refParts) {
      if (part === '#') continue;
      resolved = resolved[part];
    }
    schema = resolved || schema;
  }
  
  if (schema.type === 'array') {
    const itemType = schema.items ? getSchemaType(schema.items, spec) : 'any';
    return `Array<${itemType}>`;
  }
  
  if (schema.type === 'object' || schema.properties) {
    return 'object';
  }
  
  if (schema.enum) {
    return schema.enum.map((v: any) => typeof v === 'string' ? `"${v}"` : v).join(' | ');
  }
  
  return schema.type || 'any';
}
