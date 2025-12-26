"use client";

import React from "react";
import { ComponentConfig } from "@measured/puck";
import { Toggle as ShadcnToggle } from "@/components/ui/toggle";

export type ToggleProps = {
  text: string;
  variant: "default" | "outline";
  size: "default" | "sm" | "lg";
  defaultPressed?: boolean;
};

export const Toggle: ComponentConfig<ToggleProps> = {
  label: "Toggle",
  fields: {
    text: {
      type: "text",
      label: "Toggle Text",
      placeholder: "Enter toggle text...",
      contentEditable: true,
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
    defaultPressed: {
      type: "radio",
      label: "Default State",
      options: [
        { label: "Pressed", value: true },
        { label: "Not Pressed", value: false },
      ],
    },
  },
  defaultProps: {
    text: "Toggle",
    variant: "default",
    size: "default",
    defaultPressed: false,
  },
  render: ({ text, variant, size, defaultPressed, puck }) => {
    return (
      <div>
        <ShadcnToggle
          variant={variant}
          size={size}
          defaultPressed={defaultPressed}
          disabled={puck.isEditing}
          aria-label={text}
        >
          {text}
        </ShadcnToggle>
      </div>
    );
  },
};
