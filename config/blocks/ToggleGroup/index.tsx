"use client";

import React from "react";
import { ComponentConfig } from "@measured/puck";
import { ToggleGroup as ShadcnToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export type ToggleGroupItemType = {
  value: string;
  text: string;
  ariaLabel?: string;
};

export type ToggleGroupProps = {
  type: "single" | "multiple";
  items: ToggleGroupItemType[];
  variant: "default" | "outline";
  size: "default" | "sm" | "lg";
  spacing: number;
  defaultValue?: string;
};

export const ToggleGroup: ComponentConfig<ToggleGroupProps> = {
  label: "Toggle Group",
  fields: {
    type: {
      type: "radio",
      label: "Selection Type",
      options: [
        { label: "Single (one at a time)", value: "single" },
        { label: "Multiple (many at once)", value: "multiple" },
      ],
    },
    items: {
      type: "array",
      label: "Toggle Items",
      arrayFields: {
        value: {
          type: "text",
          label: "Value",
        },
        text: {
          type: "text",
          label: "Display Text",
        },
        ariaLabel: {
          type: "text",
          label: "Aria Label (optional)",
        },
      },
      defaultItemProps: {
        value: "",
        text: "Item",
        ariaLabel: "",
      },
      getItemSummary: (item, index) => item.text || `Item ${index + 1}`,
    },
    variant: {
      type: "select",
      label: "Variant",
      options: [
        { label: "Default", value: "default" },
        { label: "Outline", value: "outline" },
      ],
    },
    size: {
      type: "select",
      label: "Size",
      options: [
        { label: "Default", value: "default" },
        { label: "Small", value: "sm" },
        { label: "Large", value: "lg" },
      ],
    },
    spacing: {
      type: "number",
      label: "Spacing (0 for grouped)",
      min: 0,
      max: 10,
    },
    defaultValue: {
      type: "text",
      label: "Default Value (for single type)",
      placeholder: "Enter value...",
    },
  },
  defaultProps: {
    type: "single",
    items: [
      {
        value: "left",
        text: "Left",
        ariaLabel: "Align left",
      },
      {
        value: "center",
        text: "Center",
        ariaLabel: "Align center",
      },
      {
        value: "right",
        text: "Right",
        ariaLabel: "Align right",
      },
    ],
    variant: "outline",
    size: "default",
    spacing: 0,
    defaultValue: "",
  },
  render: ({ type, items = [], variant, size, spacing, defaultValue, puck }) => {
    const safeItems = Array.isArray(items) ? items : [];
    
    const toggleGroupProps =
      type === "single"
        ? {
            type: "single" as const,
            defaultValue: defaultValue || undefined,
          }
        : {
            type: "multiple" as const,
          };

    return (
      <div>
        <ShadcnToggleGroup
          {...toggleGroupProps}
          variant={variant}
          size={size}
          spacing={spacing}
          disabled={puck.isEditing}
        >
          {safeItems.map((item, index) => (
            <ToggleGroupItem
              key={item.value || `item-${index}`}
              value={item.value || `item-${index}`}
              aria-label={item.ariaLabel || item.text}
            >
              {item.text}
            </ToggleGroupItem>
          ))}
        </ShadcnToggleGroup>
      </div>
    );
  },
};
