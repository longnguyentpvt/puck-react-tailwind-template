"use client";

import React from "react";
import { ComponentConfig } from "@measured/puck";
import type { Slot } from "@measured/puck";
import { withLayout, WithLayout } from "../../components/Layout";
import {
  Dialog as ShadcnDialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

export type DialogProps = WithLayout<{
  trigger: Slot;
  title: string;
  description?: string;
  content: Slot;
  footer?: Slot;
  showTitle?: boolean;
  showDescription?: boolean;
  showFooter?: boolean;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}>;

const DialogInner: ComponentConfig<DialogProps> = {
  fields: {
    trigger: {
      type: "slot",
      label: "Trigger (Button, Card, or any component)",
    },
    showTitle: {
      type: "radio",
      label: "Show Title",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    title: {
      type: "text",
      label: "Dialog Title",
      contentEditable: true,
    },
    showDescription: {
      type: "radio",
      label: "Show Description",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    description: {
      type: "textarea",
      label: "Dialog Description",
      contentEditable: true,
    },
    content: {
      type: "slot",
      label: "Dialog Content (build with any components)",
    },
    showFooter: {
      type: "radio",
      label: "Show Footer",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    footer: {
      type: "slot",
      label: "Dialog Footer (e.g., action buttons)",
    },
    maxWidth: {
      type: "select",
      label: "Max Width",
      options: [
        { label: "Small", value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
        { label: "Extra Large", value: "xl" },
        { label: "2X Large", value: "2xl" },
        { label: "Full", value: "full" },
      ],
    },
  },
  defaultProps: {
    trigger: [],
    title: "Dialog Title",
    description: "Dialog description goes here",
    content: [],
    footer: [],
    showTitle: true,
    showDescription: true,
    showFooter: false,
    maxWidth: "lg",
  },
  render: ({
    trigger,
    title,
    description,
    content,
    footer,
    showTitle = true,
    showDescription = true,
    showFooter = false,
    maxWidth = "lg",
    puck,
  }) => {
    const isEditMode = puck.isEditing;

    const maxWidthClasses = {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl",
      "2xl": "max-w-2xl",
      full: "max-w-full",
    };

    // Create fallback components for empty slots
    const TriggerSlot = trigger || (() => <div className="text-gray-400 text-sm">Drop a component here (Button, Card, etc.)</div>);
    const ContentSlot = content || (() => <div className="text-gray-400 text-sm">Drop components here for dialog content</div>);
    const FooterSlot = footer || (() => <div className="text-gray-400 text-sm">Drop components here for footer (e.g., buttons)</div>);

    // In edit mode, show a visual representation without dialog functionality
    if (isEditMode) {
      return (
        <div className="border-2 border-dashed border-purple-300 rounded-lg">
          <div className="text-xs font-medium text-purple-600 p-2 bg-purple-50">
            Dialog Editor - Preview mode (click won't work in editor)
          </div>
          <div className="p-4 space-y-4">
            {/* Trigger Area */}
            <div className="border border-purple-200 rounded p-3 bg-purple-50/50">
              <div className="text-xs text-purple-600 font-medium mb-2">
                Trigger Area (any component):
              </div>
              <div className="min-h-[40px]">
                <TriggerSlot />
              </div>
            </div>

            {/* Dialog Content Preview */}
            <div className="border border-purple-200 rounded p-4 bg-white">
              <div className="text-xs text-purple-600 font-medium mb-3">
                Dialog Content Preview:
              </div>
              
              {showTitle && (
                <div className="mb-3">
                  <div className="text-xs text-gray-500 mb-1">Title:</div>
                  <h3 className="text-lg font-semibold">{title}</h3>
                </div>
              )}
              
              {showDescription && description && (
                <div className="mb-3">
                  <div className="text-xs text-gray-500 mb-1">Description:</div>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              )}
              
              <div className="border-t pt-3 mt-3">
                <div className="text-xs text-gray-500 mb-2">Content Area:</div>
                <div className="min-h-[100px] bg-gray-50 rounded p-2">
                  <ContentSlot />
                </div>
              </div>

              {showFooter && (
                <div className="border-t pt-3 mt-3">
                  <div className="text-xs text-gray-500 mb-2">Footer Area:</div>
                  <div className="min-h-[50px] bg-gray-50 rounded p-2">
                    <FooterSlot />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Normal render mode with full dialog functionality
    return (
      <ShadcnDialog>
        <DialogTrigger asChild>
          <div className="cursor-pointer">
            <TriggerSlot />
          </div>
        </DialogTrigger>
        <DialogContent className={maxWidthClasses[maxWidth]}>
          {(showTitle || showDescription) && (
            <DialogHeader>
              {showTitle && <DialogTitle>{title}</DialogTitle>}
              {showDescription && description && (
                <DialogDescription>{description}</DialogDescription>
              )}
            </DialogHeader>
          )}
          
          <div className="py-4">
            <ContentSlot />
          </div>

          {showFooter && (
            <DialogFooter>
              <FooterSlot />
            </DialogFooter>
          )}
        </DialogContent>
      </ShadcnDialog>
    );
  },
};

export const Dialog = withLayout(DialogInner);
