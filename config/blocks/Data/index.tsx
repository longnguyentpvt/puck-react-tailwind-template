"use client";

import React, { ReactNode } from "react";
import type { Slot, ComponentConfig, PuckComponent, PuckContext } from "@measured/puck";
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
  const dragRef = (puck as PuckContext | undefined)?.dragRef;

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
        <div ref={dragRef} className="p-4 border-2 border-dashed border-amber-400 bg-amber-50 rounded-lg">
          <p className="text-amber-700 text-sm">
            ⚠️ Data not found at path: <code className="bg-amber-100 px-1 rounded">{source}</code>
          </p>
          <Children />
        </div>
      );
    }
    return <></>;
  }

  const effectiveMode = getEffectiveMode(data, mode);

  // Wrap the content in a div with dragRef for drag-and-drop support
  const content = effectiveMode === "list" && isArrayData(data) ? (
    <ListDataRenderer
      data={data}
      variableName={variableName}
      previewIndex={previewIndex}
      maxItems={maxItems}
      isEditing={isEditing}
      children={Children}
    />
  ) : (
    <SingleDataRenderer
      data={data}
      variableName={variableName}
      children={Children}
    />
  );

  // In edit mode, wrap with draggable div
  if (isEditing && dragRef) {
    return (
      <div ref={dragRef} className="block">
        {content}
      </div>
    );
  }

  return content;
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
