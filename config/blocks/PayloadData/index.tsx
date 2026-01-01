import React from "react";
import { ComponentConfig } from "@measured/puck";
import type { Slot } from "@measured/puck";
import { Section } from "@/config/components/Section";
import { WithLayout, withLayout } from "@/config/components/Layout";
import { PayloadDataProvider } from "./context";

export type RenderMode = "repeat" | "index";
export type QueryMode = "single" | "multiple";

export type PayloadDataProps = WithLayout<{
  collection: string;
  queryMode: QueryMode;
  documentId?: string;
  whereConditions?: string; // JSON string
  renderMode: RenderMode;
  selectedIndex: number;
  limit: number;
  items: Slot;
  _payloadData?: any; // Internal property to store resolved data
}>;

// Available collections - this should match your Payload config
const availableCollections = ["users", "media", "pages"];

const PayloadDataInternal: ComponentConfig<PayloadDataProps> = {
  fields: {
    collection: {
      type: "select",
      label: "Collection",
      options: availableCollections.map((col) => ({
        label: col.charAt(0).toUpperCase() + col.slice(1),
        value: col,
      })),
    },
    queryMode: {
      type: "radio",
      label: "Query Mode",
      options: [
        { label: "Single Document", value: "single" },
        { label: "Multiple Documents", value: "multiple" },
      ],
    },
    documentId: {
      type: "text",
      label: "Document ID",
      // Only show for single mode
    },
    whereConditions: {
      type: "textarea",
      label: "Where Conditions (JSON)",
      // Only show for multiple mode
    },
    limit: {
      type: "number",
      label: "Limit (for multiple mode)",
      min: 1,
      max: 100,
    },
    renderMode: {
      type: "radio",
      label: "Render Mode (for arrays)",
      options: [
        { label: "Repeat for each item", value: "repeat" },
        { label: "Select by index", value: "index" },
      ],
    },
    selectedIndex: {
      type: "number",
      label: "Selected Index (0-based)",
      min: 0,
    },
    items: {
      type: "slot",
      label: "Child Components",
    },
  },
  defaultProps: {
    collection: "users",
    queryMode: "multiple",
    documentId: "",
    whereConditions: "",
    renderMode: "repeat",
    selectedIndex: 0,
    limit: 10,
    items: [],
  },
  resolveData: async (data) => {
    // Use server action to fetch data
    const { fetchDataForPayloadComponent } = await import("./server/actions");
    
    // Fetch data from Payload
    const { collection, queryMode, documentId, whereConditions, limit } = data.props;

    let parsedWhere = {};
    if (whereConditions) {
      try {
        parsedWhere = JSON.parse(whereConditions);
      } catch (e) {
        console.error("Invalid JSON in whereConditions:", e);
      }
    }

    const result = await fetchDataForPayloadComponent({
      collection,
      queryMode,
      documentId,
      whereConditions: parsedWhere,
      limit,
    });

    // Return the data with resolved data attached
    return {
      ...data,
      props: {
        ...data.props,
        _payloadData: result,
      },
    };
  },
  render: ({ items: Items, renderMode, selectedIndex, _payloadData }) => {
    const payloadData = _payloadData;

    if (!payloadData || !payloadData.data) {
      return (
        <Section>
          <div className="p-4 text-gray-500 border border-dashed border-gray-300 rounded">
            No data available. Check your collection and query settings.
          </div>
          <Items />
        </Section>
      );
    }

    const data = payloadData.data;
    const isArray = Array.isArray(data);

    // Single item rendering
    if (!isArray) {
      return (
        <Section>
          <PayloadDataProvider value={{ data }}>
            <Items />
          </PayloadDataProvider>
        </Section>
      );
    }

    // Array rendering - repeat mode
    if (renderMode === "repeat") {
      return (
        <Section>
          {data.map((item: any, index: number) => (
            <PayloadDataProvider
              key={item.id || index}
              value={{ data: item, index, isRepeating: true }}
            >
              <Items />
            </PayloadDataProvider>
          ))}
        </Section>
      );
    }

    // Array rendering - index mode
    const selectedItem = data[selectedIndex];
    if (!selectedItem) {
      return (
        <Section>
          <div className="p-4 text-gray-500 border border-dashed border-gray-300 rounded">
            No item at index {selectedIndex}. Available items: {data.length}
          </div>
          <Items />
        </Section>
      );
    }

    return (
      <Section>
        <PayloadDataProvider value={{ data: selectedItem, index: selectedIndex }}>
          <Items />
        </PayloadDataProvider>
      </Section>
    );
  },
};

export const PayloadData = withLayout(PayloadDataInternal);
