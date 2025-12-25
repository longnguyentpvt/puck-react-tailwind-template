"use client";

import React from "react";
import { ComponentConfig } from "@measured/puck";
import type { Slot } from "@measured/puck";
import { withLayout, WithLayout } from "../../components/Layout";
import {
  Accordion as ShadcnAccordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export type AccordionItemType = {
  id: string;
  trigger: Slot;
  content: Slot;
};

export type AccordionProps = WithLayout<{
  items: AccordionItemType[];
  type: "single" | "multiple";
  collapsible?: boolean;
  showBorders?: boolean;
  className?: string;
}>;

const AccordionInner: ComponentConfig<AccordionProps> = {
  fields: {
    items: {
      type: "array",
      label: "Accordion Items",
      arrayFields: {
        id: {
          type: "text",
          label: "ID (auto-generated)",
        },
        trigger: {
          type: "slot",
          label: "Trigger Content",
        },
        content: {
          type: "slot",
          label: "Panel Content",
        },
      },
      defaultItemProps: {
        id: "",
        trigger: [],
        content: [],
      },
      getItemSummary: (item, index) => `Item ${index + 1}`,
    },
    type: {
      type: "radio",
      label: "Type",
      options: [
        { label: "Single (one at a time)", value: "single" },
        { label: "Multiple (many at once)", value: "multiple" },
      ],
    },
    collapsible: {
      type: "radio",
      label: "Collapsible (for single type)",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    showBorders: {
      type: "radio",
      label: "Trigger Separator",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    className: {
      type: "text",
      label: "Additional CSS Classes",
    },
  },
  defaultProps: {
    items: [
      {
        id: "item-1",
        trigger: [],
        content: [],
      },
      {
        id: "item-2",
        trigger: [],
        content: [],
      },
      {
        id: "item-3",
        trigger: [],
        content: [],
      },
    ],
    type: "single",
    collapsible: true,
    showBorders: true,
    className: "",
  },
  render: ({ items = [], type, collapsible, showBorders = true, className, puck }) => {
    const isEditMode = puck.isEditing;

    // Ensure items is always an array
    const safeItems = Array.isArray(items) ? items : [];

    // In edit mode, show all content areas expanded for easy editing
    if (isEditMode) {
      return (
        <div className="border-2 border-dashed border-blue-300 rounded-lg">
          <div className="text-xs font-medium text-blue-600 p-2 bg-blue-50">
            Accordion Editor - All items expanded for editing
          </div>
          <div className={className}>
            {safeItems.map((item, index) => {
              const Trigger = item.trigger || (() => <div className="text-gray-400 text-sm">Drop components here for trigger</div>);
              const Content = item.content || (() => <div className="text-gray-400 text-sm">Drop components here for content</div>);
              const itemId = item.id || `item-${index}`;
              return (
                <div key={itemId} className="border-b last:border-b-0">
                  <div className="py-4 px-4 font-medium bg-gray-50 min-h-15">
                    <div className="text-xs text-gray-500 mb-2">Trigger Area:</div>
                    <Trigger />
                  </div>
                  <div className="p-4 min-h-25 bg-white border-l-4 border-blue-200">
                    <div className="text-xs text-gray-500 mb-2">Content Area:</div>
                    <Content />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // Normal render mode with accordion functionality
    const accordionProps =
      type === "single"
        ? {
            type: "single" as const,
            collapsible: collapsible,
          }
        : {
            type: "multiple" as const,
          };

    return (
      <ShadcnAccordion {...accordionProps} className={className}>
        {safeItems.map((item, index) => {
          const Trigger = item.trigger || (() => <div>Accordion Item {index + 1}</div>);
          const Content = item.content || (() => <div>Content</div>);
          const itemId = item.id || `item-${index}`;
          return (
            <AccordionItem 
              key={itemId} 
              value={itemId}
              showBorder={showBorders}
            >
              <AccordionTrigger>
                <Trigger />
              </AccordionTrigger>
              <AccordionContent>
                <Content />
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </ShadcnAccordion>
    );
  },
};

export const Accordion = withLayout(AccordionInner);
