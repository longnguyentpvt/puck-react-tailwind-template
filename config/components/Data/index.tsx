"use client";

import React, { ReactNode } from "react";
import {
  ComponentConfig,
  DefaultComponentProps,
  ObjectField,
} from "@measured/puck";
import { DataScopeProvider, DataScope, getValueByPath } from "@/lib/data-binding";

/**
 * Data binding mode for handling different data types
 */
export type DataMode = "none" | "auto" | "single" | "list";

/**
 * Data binding field props that can be added to any component
 */
export type DataFieldProps = {
  /**
   * Path to the data source (e.g., "externalData.products" or "externalData.user")
   * Uses dot notation to access nested data
   */
  source?: string;
  /**
   * Variable name to expose the data as in the scope
   * Children can access it using {{variableName.fieldPath}}
   */
  as?: string;
  /**
   * Mode for handling the data:
   * - "none": No data binding
   * - "auto": Automatically detect if data is array or object
   * - "single": Treat data as a single object
   * - "list": Treat data as an array and loop over items
   */
  mode?: DataMode;
  /**
   * For list mode in editor: which item index to preview (0-based)
   */
  previewIndex?: number;
  /**
   * Maximum items to render in list mode (0 = unlimited)
   */
  maxItems?: number;
};

export type WithData<Props extends DefaultComponentProps> = Props & {
  data?: DataFieldProps;
};

/**
 * Data binding field definition
 */
export const dataField: ObjectField<DataFieldProps> = {
  type: "object",
  label: "Data Binding",
  objectFields: {
    mode: {
      type: "select",
      label: "Mode",
      options: [
        { label: "None (no data binding)", value: "none" },
        { label: "Auto (detect from data)", value: "auto" },
        { label: "Single Object", value: "single" },
        { label: "List (loop)", value: "list" },
      ],
    },
    source: {
      type: "text",
      label: "Data Source",
    },
    as: {
      type: "text",
      label: "Variable Name",
    },
    previewIndex: {
      type: "number",
      label: "Preview Item Index",
      min: 0,
    },
    maxItems: {
      type: "number",
      label: "Max Items (0 = unlimited)",
      min: 0,
    },
  },
};

/**
 * Helper to detect if value is an array
 */
function isArrayData(data: unknown): data is unknown[] {
  return Array.isArray(data);
}

/**
 * Helper to determine effective mode based on data and mode setting
 */
function getEffectiveMode(data: unknown, mode: DataMode): "single" | "list" | "none" {
  if (mode === "none" || !mode) return "none";
  if (mode === "list") return "list";
  if (mode === "single") return "single";
  // Auto mode
  return isArrayData(data) ? "list" : "single";
}

/**
 * Mock external data for demonstration
 * In production, this would come from externalData passed via Puck
 */
const mockExternalData = {
  products: [
    { id: 1, name: "Product 1", price: 99.99 },
    { id: 2, name: "Product 2", price: 149.99 },
    { id: 3, name: "Product 3", price: 199.99 },
  ],
  user: {
    name: "John Doe",
    email: "john@example.com",
  },
};

/**
 * Props for the DataWrapper component
 */
interface DataWrapperProps {
  data?: DataFieldProps;
  isEditing: boolean;
  children: ReactNode;
}

/**
 * DataWrapper component that wraps children with data scope when configured
 */
export function DataWrapper({ data, isEditing, children }: DataWrapperProps) {
  // If no data binding is configured, render children directly
  if (!data || data.mode === "none" || !data.source || !data.as) {
    return <>{children}</>;
  }

  const { source, as: variableName, mode = "auto", previewIndex = 0, maxItems = 0 } = data;

  // Resolve the source path to get the data
  // Remove "externalData." prefix if present
  const cleanPath = source.startsWith("externalData.")
    ? source.substring("externalData.".length)
    : source;
  
  const resolvedData = cleanPath ? getValueByPath(mockExternalData, cleanPath) : mockExternalData;

  // Handle missing data
  if (resolvedData === undefined || resolvedData === null) {
    return <>{children}</>;
  }

  const effectiveMode = getEffectiveMode(resolvedData, mode);

  if (effectiveMode === "none") {
    return <>{children}</>;
  }

  if (effectiveMode === "list" && isArrayData(resolvedData)) {
    // In edit mode, only show the preview item
    if (isEditing) {
      const actualIndex = resolvedData[previewIndex] !== undefined ? previewIndex : 0;
      const previewItem = resolvedData[actualIndex];
      const variables: DataScope = {
        [variableName]: previewItem,
        index: actualIndex,
      };

      return (
        <DataScopeProvider variables={variables}>
          {children}
        </DataScopeProvider>
      );
    }

    // In render mode, render all items (respecting maxItems)
    const itemsToRender = maxItems > 0 ? resolvedData.slice(0, maxItems) : resolvedData;

    return (
      <>
        {itemsToRender.map((item, index) => {
          const variables: DataScope = {
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
  }

  // Single object mode
  const variables: DataScope = {
    [variableName]: resolvedData,
  };

  return (
    <DataScopeProvider variables={variables}>
      {children}
    </DataScopeProvider>
  );
}

/**
 * HOC that adds data binding capabilities to a component
 */
export function withData<
  ThisComponentConfig extends ComponentConfig<any> = ComponentConfig
>(componentConfig: ThisComponentConfig): ThisComponentConfig {
  const originalRender = componentConfig.render;

  return {
    ...componentConfig,
    fields: {
      ...componentConfig.fields,
      data: dataField,
    },
    defaultProps: {
      ...componentConfig.defaultProps,
      data: {
        mode: "none",
        source: "",
        as: "",
        previewIndex: 0,
        maxItems: 0,
        ...componentConfig.defaultProps?.data,
      },
    },
    render: (props) => {
      const isEditing = props.puck?.isEditing ?? false;
      const dataProps = props.data as DataFieldProps | undefined;

      // Get the original rendered content
      const content = originalRender(props);

      // Wrap with DataWrapper
      return (
        <DataWrapper data={dataProps} isEditing={isEditing}>
          {content}
        </DataWrapper>
      );
    },
  };
}
