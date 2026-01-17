"use client";

import React from "react";
import {
  ComponentConfig,
  DefaultComponentProps,
  CustomField,
} from "@measured/puck";
import { useDataScope } from "@/lib/data-binding";

/**
 * Props for components that support data payload hints
 */
export type WithDataPayloadHint<Props extends DefaultComponentProps> = Props;

/**
 * Custom field component that displays the current data scope payload as JSON
 * This helps users understand what data is available from parent components
 */
const DataPayloadHintField: React.FC<{ name: string; value?: any }> = ({ name, value }) => {
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
  render: ({ name, value }) => <DataPayloadHintField name={name} value={value} />,
};

/**
 * HOC that adds data payload hint field to a component.
 * This shows users what data is available from parent layout components.
 * 
 * The hint field is displayed in the editor sidebar when the component is selected,
 * showing the current data scope in JSON format with usage examples.
 * 
 * @example
 * ```tsx
 * const Card = withDataPayloadHint(CardInternal);
 * ```
 */
export function withDataPayloadHint<
  ThisComponentConfig extends ComponentConfig<any> = ComponentConfig
>(componentConfig: ThisComponentConfig): ThisComponentConfig {
  return {
    ...componentConfig,
    fields: {
      // Add the data payload hint field at the top
      _dataPayloadHint: dataPayloadHintField,
      // Spread existing fields
      ...componentConfig.fields,
    },
    defaultProps: {
      ...componentConfig.defaultProps,
      _dataPayloadHint: undefined, // This field doesn't need a value
    },
    // Keep the original render function unchanged
    render: componentConfig.render,
  };
}
