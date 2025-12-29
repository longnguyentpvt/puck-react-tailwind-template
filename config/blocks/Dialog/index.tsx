"use client";

import React, { useEffect, useRef, useState } from "react";
import { ComponentConfig, registerOverlayPortal } from "@measured/puck";
import type { Slot } from "@measured/puck";
import { withLayout, WithLayout } from "../../components/Layout";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
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
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const dialogContentRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const iframeRef = useRef<HTMLElement | null>(null);

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

    // Find the iframe container in edit mode
    useEffect(() => {
      if (isEditMode) {
        // Try to find the iframe element where content is rendered
        const iframe = document.querySelector('[data-iframe-document]') as HTMLElement;
        if (iframe) {
          iframeRef.current = iframe;
        }
      }
    }, [isEditMode]);

    // Register trigger as overlay portal in edit mode so it remains clickable
    useEffect(() => {
      if (isEditMode && triggerRef.current) {
        const cleanup = registerOverlayPortal(triggerRef.current, {
          disableDrag: false,
        });
        return cleanup;
      }
    }, [isEditMode]);

    // Register dialog content as overlay portal when dialog is open in edit mode
    useEffect(() => {
      if (isEditMode && isDialogOpen && dialogContentRef.current) {
        const cleanup = registerOverlayPortal(dialogContentRef.current, {
          disableDrag: false,
        });
        return cleanup;
      }
    }, [isEditMode, isDialogOpen]);

    // In edit mode, show trigger with click handler to open dialog
    if (isEditMode) {
      return (
        <div className="border-2 border-dashed border-purple-300 rounded-lg">
          <div className="text-xs font-medium text-purple-600 p-2 bg-purple-50">
            Dialog Component
          </div>
          <div className="p-4 space-y-4">
            {/* Trigger Area - clickable in edit mode */}
            <div className="border border-purple-200 rounded p-3 bg-purple-50/50">
              <div className="text-xs text-purple-600 font-medium mb-2">
                Trigger (click to open dialog):
              </div>
              <div 
                ref={triggerRef}
                className="min-h-[40px] cursor-pointer"
                onClick={() => setIsDialogOpen(true)}
              >
                <TriggerSlot />
              </div>
            </div>

            {/* Info about clicking trigger */}
            <div className="text-xs text-gray-600 bg-blue-50 border border-blue-200 rounded p-2">
              💡 Click the trigger above to open and edit the dialog content.
            </div>
          </div>

          {/* Dialog for editing - opens when trigger is clicked */}
          {/* Render inline in edit mode instead of using portal */}
          {isDialogOpen && (
            <div 
              className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
              onClick={() => setIsDialogOpen(false)}
            >
              <div 
                ref={dialogContentRef}
                className={cn(
                  "relative bg-background p-6 shadow-lg rounded-lg grid gap-4 w-full",
                  maxWidthClasses[maxWidth]
                )}
                onClick={(e) => e.stopPropagation()}
              >
                {(showTitle || showDescription) && (
                  <div className="flex flex-col space-y-1.5 text-center sm:text-left">
                    {showTitle && (
                      <div className="text-lg font-semibold leading-none tracking-tight">
                        {title}
                      </div>
                    )}
                    {showDescription && description && (
                      <div className="text-sm text-muted-foreground">{description}</div>
                    )}
                  </div>
                )}
                
                <div className="py-4">
                  <ContentSlot />
                </div>

                {showFooter && (
                  <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                    <FooterSlot />
                  </div>
                )}

                <div className="text-xs text-gray-500 mt-4 pt-4 border-t">
                  💡 Drag components here to build your dialog. Close to return to the main editor.
                </div>

                <button
                  onClick={() => setIsDialogOpen(false)}
                  className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }

    // Normal render mode with full dialog functionality
    return (
      <ShadcnDialog>
        <DialogTrigger asChild={false}>
          <div className="inline-block cursor-pointer">
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
