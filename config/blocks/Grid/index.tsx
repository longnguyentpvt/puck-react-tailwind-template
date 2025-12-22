import React from "react";
import { ComponentConfig } from "@measured/puck";
import type { Slot } from "@measured/puck";
import { Section } from "@/config/components/Section";
import { withLayout } from "@/config/components/Layout";

export type GridProps = {
  containerType: "full-width" | "container";
  numColumns: number;
  gap: string;
  items: Slot;
};

export const GridInternal: ComponentConfig<GridProps> = {
  fields: {
    containerType: {
      label: "Container Type",
      type: "radio",
      options: [
        { label: "Full Width", value: "full-width" },
        { label: "Responsive Container", value: "container" },
      ],
    },
    numColumns: {
      type: "number",
      label: "Number of columns",
      min: 1,
      max: 12,
    },
    gap: {
      label: "Gap",
      type: "select",
      options: [
        { label: "None (0)", value: "0" },
        { label: "XS (4px)", value: "1" },
        { label: "SM (8px)", value: "2" },
        { label: "MD (12px)", value: "3" },
        { label: "LG (16px)", value: "4" },
        { label: "XL (20px)", value: "5" },
        { label: "2XL (24px)", value: "6" },
        { label: "3XL (32px)", value: "8" },
        { label: "4XL (40px)", value: "10" },
        { label: "5XL (48px)", value: "12" },
      ],
    },
    items: {
      type: "slot",
    },
  },
  defaultProps: {
    containerType: "full-width",
    numColumns: 4,
    gap: "6",
    items: [],
  },
  render: ({ containerType, gap, numColumns, items: Items }) => {
    const containerClass = containerType === "container" ? "container mx-auto" : "w-full";
    
    const gutterClass = {
      "0": "gutter-0",
      "1": "gutter-1",
      "2": "gutter-2",
      "3": "gutter-3",
      "4": "gutter-4",
      "5": "gutter-5",
      "6": "gutter-6",
      "8": "gutter-8",
      "10": "gutter-10",
      "12": "gutter-12",
    }[gap];

    return (
      <Items
        className={`${containerClass} grid ${gutterClass}`}
        style={{
          gridTemplateColumns: `repeat(${numColumns}, 1fr)`,
        }}
      />
    );
  },
};

export const Grid = withLayout(GridInternal);
