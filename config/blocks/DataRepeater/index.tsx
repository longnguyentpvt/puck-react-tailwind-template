import React from "react";
import { ComponentConfig } from "@measured/puck";
import type { Slot } from "@measured/puck";
import { Section } from "@/config/components/Section";
import { withLayout, WithLayout } from "@/config/components/Layout";
import { Pet } from "@/lib/external-data";

export type DataRepeaterProps = WithLayout<{
  data: any[];
  title?: string;
  layoutType?: "grid" | "flex" | "stack";
  columns?: number;
  gap?: string;
  items: Slot;
}>;

/**
 * DataRepeater component - A flexible wrapper for rendering external data
 * 
 * This component creates a slot for each data item, allowing users to drag
 * any component into each slot. The data item is made available to child
 * components through the zone context.
 * 
 * Use cases:
 * - Render a list of items with custom components for each property
 * - Create flexible data-driven layouts
 * - Dynamically compose UI from external data
 */
const DataRepeaterInternal: ComponentConfig<DataRepeaterProps> = {
  fields: {
    title: {
      type: "text",
      label: "Title (optional)",
    },
    data: {
      type: "external",
      label: "Data Source",
      // Fetch data from the API endpoint
      // This example uses pets, but you can adapt it to any data source
      fetchList: async ({ query }) => {
        try {
          const baseUrl = typeof window !== 'undefined' 
            ? window.location.origin 
            : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
          
          const response = await fetch(`${baseUrl}/api/pets`);
          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }
          const data = await response.json();
          
          // Filter by query if provided
          const filteredData = query
            ? data.filter((item: any) => 
                JSON.stringify(item).toLowerCase().includes(query.toLowerCase())
              )
            : data;
          
          return filteredData.map((item: any) => ({
            value: item,
            label: item.name || item.title || item.id || 'Item',
          }));
        } catch (error) {
          console.error("Error loading data:", error);
          return [];
        }
      },
    },
    layoutType: {
      type: "select",
      label: "Layout Type",
      options: [
        { label: "Grid", value: "grid" },
        { label: "Flex Row", value: "flex" },
        { label: "Stack (Vertical)", value: "stack" },
      ],
    },
    columns: {
      type: "number",
      label: "Columns (Grid only)",
      min: 1,
      max: 6,
    },
    gap: {
      type: "select",
      label: "Gap",
      options: [
        { label: "None", value: "0" },
        { label: "Small", value: "4" },
        { label: "Medium", value: "6" },
        { label: "Large", value: "8" },
      ],
    },
    items: {
      type: "slot",
      label: "Item Template",
    },
  },
  defaultProps: {
    data: [],
    title: "",
    layoutType: "grid",
    columns: 3,
    gap: "6",
    items: [],
    layout: {
      paddingTop: "8",
      paddingBottom: "8",
    },
  },
  render: ({ title, data: externalData, layoutType, columns, gap, items: Items }) => {
    const gapClass = `gap-${gap}`;
    
    const containerClass = 
      layoutType === "grid" 
        ? `grid grid-cols-1 md:grid-cols-${columns} ${gapClass}` 
        : layoutType === "flex"
        ? `flex flex-wrap ${gapClass}`
        : `flex flex-col ${gapClass}`;

    // Cast to array type to avoid TypeScript confusion
    const dataItems = (externalData as unknown as any[]) || [];

    return (
      <Section>
        <div className="w-full">
          {title && (
            <h2 className="text-3xl font-bold mb-6 text-center">
              {title}
            </h2>
          )}
          
          {dataItems && dataItems.length > 0 ? (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800 font-medium mb-2">
                  🎯 {dataItems.length} data item{dataItems.length !== 1 ? 's' : ''} loaded
                </p>
                <p className="text-xs text-blue-600">
                  Each item below shows its data. Drag components into the slot area to create your custom layout.
                </p>
              </div>
              
              <div className={containerClass}>
                {dataItems.map((item: any, index: number) => (
                  <div 
                    key={item.id || index}
                    className="border-2 border-dashed border-blue-200 rounded-lg p-4 bg-white"
                  >
                    {/* Render slot for this data item */}
                    <div className="min-h-[100px] mb-3">
                      <Items />
                    </div>
                    
                    {/* Show data available for this item */}
                    <div className="mt-2 pt-3 border-t border-gray-200">
                      <details className="text-xs">
                        <summary className="cursor-pointer font-medium text-gray-600 hover:text-gray-900">
                          📊 Item #{index + 1}: {item.name || item.title || 'Data'}
                        </summary>
                        <pre className="mt-2 overflow-auto bg-gray-50 p-2 rounded text-xs">
                          {JSON.stringify(item, null, 2)}
                        </pre>
                        <p className="mt-2 text-gray-500 italic">
                          Note: To access this data in child components, you would need to implement context passing through Puck's zone system.
                        </p>
                      </details>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-500 mb-2">📦 No data selected</p>
              <p className="text-sm text-gray-400">Click the "External item" button above to select data from your source</p>
            </div>
          )}
        </div>
      </Section>
    );
  },
};

export const DataRepeater = withLayout(DataRepeaterInternal);
