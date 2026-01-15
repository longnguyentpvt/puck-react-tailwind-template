import React from "react";
import { ComponentConfig } from "@measured/puck";
import type { Slot } from "@measured/puck";
import { Section } from "@/config/components/Section";
import { WithLayout, withLayout } from "@/config/components/Layout";

export type FlexItemProps = {
  alignSelf?: "auto" | "start" | "center" | "end" | "stretch";
  justifySelf?: "auto" | "start" | "center" | "end" | "stretch";
  flex?: "1" | "auto" | "initial" | "none";
};

export type FlexProps = WithLayout<{
  containerType: "full-width" | "container";
  justifyContent: "start" | "center" | "end" | "between" | "around" | "evenly";
  alignItems: "start" | "center" | "end" | "stretch" | "baseline";
  direction: "row" | "column" | "row-reverse" | "column-reverse";
  gap: string;
  wrap: "wrap" | "nowrap" | "wrap-reverse";
  items: Slot;
}>;

const FlexInternal: ComponentConfig<FlexProps> = {
  fields: {
    containerType: {
      label: "Container Type",
      type: "radio",
      options: [
        { label: "Full Width", value: "full-width" },
        { label: "Responsive Container", value: "container" },
      ],
    },
    direction: {
      label: "Direction",
      type: "select",
      options: [
        { label: "Row", value: "row" },
        { label: "Column", value: "column" },
        { label: "Row Reverse", value: "row-reverse" },
        { label: "Column Reverse", value: "column-reverse" },
      ],
    },
    justifyContent: {
      label: "Justify Content",
      type: "select",
      options: [
        { label: "Start", value: "start" },
        { label: "Center", value: "center" },
        { label: "End", value: "end" },
        { label: "Space Between", value: "between" },
        { label: "Space Around", value: "around" },
        { label: "Space Evenly", value: "evenly" },
      ],
    },
    alignItems: {
      label: "Align Items",
      type: "select",
      options: [
        { label: "Start", value: "start" },
        { label: "Center", value: "center" },
        { label: "End", value: "end" },
        { label: "Stretch", value: "stretch" },
        { label: "Baseline", value: "baseline" },
      ],
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
    wrap: {
      label: "Wrap",
      type: "select",
      options: [
        { label: "Wrap", value: "wrap" },
        { label: "No Wrap", value: "nowrap" },
        { label: "Wrap Reverse", value: "wrap-reverse" },
      ],
    },
    items: {
      type: "slot",
    },
  },
  defaultProps: {
    containerType: "full-width",
    justifyContent: "start",
    alignItems: "stretch",
    direction: "row",
    gap: "6",
    wrap: "wrap",
    layout: {
      flex: "1",
    },
    items: [],
  },
  render: ({ containerType, justifyContent, alignItems, direction, gap, wrap, items: Items }) => {
    const containerClass = containerType === "container" ? "container mx-auto" : "w-full";
    
    const directionClass = {
      row: "flex-row",
      column: "flex-col",
      "row-reverse": "flex-row-reverse",
      "column-reverse": "flex-col-reverse",
    }[direction];

    const justifyClass = {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly",
    }[justifyContent];

    const alignClass = {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
      baseline: "items-baseline",
    }[alignItems];

    const wrapClass = {
      wrap: "flex-wrap",
      nowrap: "flex-nowrap",
      "wrap-reverse": "flex-wrap-reverse",
    }[wrap];

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
        className={`${containerClass} flex h-full ${directionClass} ${justifyClass} ${alignClass} ${wrapClass} ${gutterClass}`}
      />
    );
  },
};

// Apply only withLayout - data binding for slot looping should use the DataRepeater block
export const Flex = withLayout(FlexInternal);
