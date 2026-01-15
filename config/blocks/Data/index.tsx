"use client";

import React, { ReactNode } from "react";
import type { Slot, ComponentConfig, PuckComponent } from "@measured/puck";
import { DataScopeProvider, DataScope, getValueByPath } from "@/lib/data-binding";

/**
 * Data component mode for handling different data types
 */
export type DataMode = "auto" | "single" | "list";

/**
 * Props for the Data wrapper component
 */
export type DataProps = {
  /**
   * Path to the data source (e.g., "externalData.products" or "externalData.user")
   * Uses dot notation to access nested data
   */
  source: string;
  /**
   * Variable name to expose the data as in the scope
   * Children can access it using {{variableName.fieldPath}}
   */
  as: string;
  /**
   * Mode for handling the data:
   * - "auto": Automatically detect if data is array or object
   * - "single": Treat data as a single object
   * - "list": Treat data as an array and loop over items
   */
  mode: DataMode;
  /**
   * For list mode in editor: which item index to preview (0-based)
   */
  previewIndex: number;
  /**
   * Maximum items to render in list mode (0 = unlimited)
   */
  maxItems: number;
  /**
   * Slot for child components
   */
  children: Slot;
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
function getEffectiveMode(data: unknown, mode: DataMode): "single" | "list" {
  if (mode === "list") return "list";
  if (mode === "single") return "single";
  // Auto mode
  return isArrayData(data) ? "list" : "single";
}

/**
 * Slot render component type (this is what Slot becomes at render time)
 */
type SlotRenderComponent = (props?: { className?: string }) => ReactNode;

/**
 * Render children with single object data
 */
function SingleDataRenderer({
  data,
  variableName,
  children: Children,
}: {
  data: unknown;
  variableName: string;
  children: SlotRenderComponent;
}) {
  const variables: DataScope = {
    [variableName]: data,
  };

  return (
    <DataScopeProvider variables={variables}>
      <Children />
    </DataScopeProvider>
  );
}

/**
 * Render children for each item in array data
 */
function ListDataRenderer({
  data,
  variableName,
  previewIndex,
  maxItems,
  isEditing,
  children: Children,
}: {
  data: unknown[];
  variableName: string;
  previewIndex: number;
  maxItems: number;
  isEditing: boolean;
  children: SlotRenderComponent;
}) {
  // In edit mode, only show the preview item
  if (isEditing) {
    // Ensure index matches the actual item being shown
    const actualIndex = data[previewIndex] !== undefined ? previewIndex : 0;
    const previewItem = data[actualIndex];
    const variables: DataScope = {
      [variableName]: previewItem,
      index: actualIndex,
    };

    return (
      <DataScopeProvider variables={variables}>
        <Children />
      </DataScopeProvider>
    );
  }

  // In render mode, render all items (respecting maxItems)
  const itemsToRender = maxItems > 0 ? data.slice(0, maxItems) : data;

  return (
    <>
      {itemsToRender.map((item, index) => {
        const variables: DataScope = {
          [variableName]: item,
          index,
        };

        return (
          <DataScopeProvider key={index} variables={variables}>
            <Children />
          </DataScopeProvider>
        );
      })}
    </>
  );
}

/**
 * Main render component for Data component
 * 
 * The Data component is designed to be "transparent" to the layout system.
 * It does not add any wrapper elements, so children maintain their direct
 * relationship with the parent layout (Flex/Grid). This ensures layout
 * options work correctly for components inside Data.
 */
const DataRenderer: PuckComponent<DataProps> = ({
  source,
  as: variableName,
  mode,
  previewIndex,
  maxItems,
  children: Children,
  puck,
}) => {
  const isEditing = puck?.isEditing ?? false;

  // For now, we'll use a placeholder data object
  // In a real implementation, this would come from externalData passed via Puck
  // The source prop would be used to select data from externalData
  
  // Mock external data for demonstration
  // In production, this would be: const rootData = useExternalData();
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

  // Resolve the source path to get the data
  // Remove "externalData." prefix if present
  const cleanPath = source.startsWith("externalData.")
    ? source.substring("externalData.".length)
    : source;
  
  const data = cleanPath ? getValueByPath(mockExternalData, cleanPath) : mockExternalData;

  // Handle missing data
  if (data === undefined || data === null) {
    if (isEditing) {
      return (
        <>
          <Children />
        </>
      );
    }
    return <></>;
  }

  const effectiveMode = getEffectiveMode(data, mode);

  // Render content without wrapper - Data component is transparent to layout
  if (effectiveMode === "list" && isArrayData(data)) {
    return (
      <ListDataRenderer
        data={data}
        variableName={variableName}
        previewIndex={previewIndex}
        maxItems={maxItems}
        isEditing={isEditing}
        children={Children}
      />
    );
  }

  return (
    <SingleDataRenderer
      data={data}
      variableName={variableName}
      children={Children}
    />
  );
};

/**
 * Data component configuration for Puck editor
 */
export const Data: ComponentConfig<DataProps> = {
  label: "Data",
  fields: {
    source: {
      type: "text",
      label: "Data Source",
    },
    as: {
      type: "text",
      label: "Variable Name",
    },
    mode: {
      type: "select",
      label: "Mode",
      options: [
        { label: "Auto (detect from data)", value: "auto" },
        { label: "Single Object", value: "single" },
        { label: "List (loop)", value: "list" },
      ],
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
    children: {
      type: "slot",
    },
  },
  defaultProps: {
    source: "externalData.items",
    as: "item",
    mode: "auto",
    previewIndex: 0,
    maxItems: 0,
    children: [],
  },
  render: DataRenderer,
};
