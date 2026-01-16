"use client";

import React from "react";
import { ComponentConfig } from "@measured/puck";
import type { Slot } from "@measured/puck";
import { WithLayout, withLayout } from "@/config/components/Layout";
import { DataScopeProvider, DataScope, getValueByPath } from "@/lib/data-binding";

/**
 * Data binding mode for handling different data types
 */
export type DataMode = "none" | "auto" | "single" | "list";

/**
 * Props for the DataRender block
 */
export type DataRenderProps = WithLayout<{
  /**
   * Path to the data source (e.g., "externalData.products" or "externalData.user")
   */
  source: string;
  /**
   * Variable name to expose the data as in the scope
   */
  as: string;
  /**
   * Mode for handling the data
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
   * The slot containing the template to repeat
   */
  template: Slot;
}>;

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
 * Single item renderer with layout applied
 */
const DataRenderItemInternal: ComponentConfig<DataRenderProps & { _itemData?: unknown; _itemIndex?: number; _totalItems?: number }> = {
  render: ({ source, as: variableName, template: Template, _itemData, _itemIndex = 0, _totalItems = 1 }) => {
    const variables: DataScope = {
      [variableName]: _itemData,
      index: _itemIndex,
      total: _totalItems,
    };

    return (
      <DataScopeProvider variables={variables}>
        <Template />
      </DataScopeProvider>
    );
  },
};

// Apply withLayout to the single item renderer
const DataRenderItem = withLayout(DataRenderItemInternal);

const DataRenderInternal: ComponentConfig<DataRenderProps> = {
  label: "Data Render",
  fields: {
    mode: {
      type: "select",
      label: "Mode",
      options: [
        { label: "None (no data binding)", value: "none" },
        { label: "Auto (detect from data)", value: "auto" },
        { label: "Single Object", value: "single" },
        { label: "List (repeat for each item)", value: "list" },
      ],
    },
    source: {
      type: "text",
      label: "Data Source Path",
      placeholder: "e.g., externalData.products",
    },
    as: {
      type: "text",
      label: "Variable Name",
      placeholder: "e.g., item, product, user",
    },
    previewIndex: {
      type: "number",
      label: "Preview Item Index (editor only)",
      min: 0,
    },
    maxItems: {
      type: "number",
      label: "Max Items (0 = unlimited)",
      min: 0,
    },
    template: {
      type: "slot",
      label: "Template",
    },
  },
  defaultProps: {
    mode: "list",
    source: "products",
    as: "item",
    previewIndex: 0,
    maxItems: 0,
    template: [],
    layout: {
      flex: "1",
    },
  },
  render: (props) => {
    const { source, as: variableName, mode, previewIndex, maxItems, template: Template, puck, layout } = props;
    const isEditing = puck?.isEditing ?? false;

    // If no data binding is configured, render template directly with layout
    if (mode === "none" || !source || !variableName) {
      return <DataRenderItem.render {...props} _itemData={{}} _itemIndex={0} _totalItems={1} />;
    }

    // Get data from externalData or fallback to mock data
    // @ts-ignore - externalData may not be in type but can be passed via Puck
    const externalData = props.externalData || puck?.externalData || mockExternalData;

    // Resolve the source path to get the data
    const cleanPath = source.startsWith("externalData.")
      ? source.substring("externalData.".length)
      : source;
    
    const resolvedData = cleanPath ? getValueByPath(externalData, cleanPath) : externalData;

    // Handle missing data
    if (resolvedData === undefined || resolvedData === null) {
      return <DataRenderItem.render {...props} _itemData={{}} _itemIndex={0} _totalItems={1} />;
    }

    const effectiveMode = getEffectiveMode(resolvedData, mode);

    if (effectiveMode === "none") {
      return <DataRenderItem.render {...props} _itemData={{}} _itemIndex={0} _totalItems={1} />;
    }

    // Single object mode - render once with layout
    if (effectiveMode === "single") {
      return <DataRenderItem.render {...props} _itemData={resolvedData} _itemIndex={0} _totalItems={1} />;
    }

    // List mode - repeat the template for each item
    if (!isArrayData(resolvedData)) {
      return <DataRenderItem.render {...props} _itemData={{}} _itemIndex={0} _totalItems={1} />;
    }

    // In edit mode, only show the preview item to keep the editor clean
    if (isEditing) {
      const actualIndex = resolvedData[previewIndex] !== undefined ? previewIndex : 0;
      const previewItem = resolvedData[actualIndex];
      return (
        <DataRenderItem.render 
          {...props} 
          _itemData={previewItem} 
          _itemIndex={actualIndex} 
          _totalItems={resolvedData.length} 
        />
      );
    }

    // In render mode, render all items (respecting maxItems)
    // Each item gets its own layout wrapper
    const itemsToRender = maxItems > 0 ? resolvedData.slice(0, maxItems) : resolvedData;

    return (
      <>
        {itemsToRender.map((item, index) => (
          <DataRenderItem.render
            key={index}
            {...props}
            _itemData={item}
            _itemIndex={index}
            _totalItems={resolvedData.length}
          />
        ))}
      </>
    );
  },
};

export const DataRender = DataRenderInternal;
