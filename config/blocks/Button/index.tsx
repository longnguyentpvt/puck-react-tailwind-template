import React from "react";
import { ComponentConfig } from "@measured/puck";
import { Button as ShadcnButton } from "@/components/ui/button";
import { useTemplateParsing } from "@/config/components/TemplateParsing";

export type ButtonProps = {
  label: string;
  href: string;
  variant: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size: "default" | "sm" | "lg" | "icon";
};

export const Button: ComponentConfig<ButtonProps> = {
  label: "Button",
  fields: {
    label: {
      type: "text",
      placeholder: "Button text...",
      contentEditable: true,
    },
    href: { type: "text" },
    variant: {
      type: "select",
      options: [
        { label: "Default", value: "default" },
        { label: "Destructive", value: "destructive" },
        { label: "Outline", value: "outline" },
        { label: "Secondary", value: "secondary" },
        { label: "Ghost", value: "ghost" },
        { label: "Link", value: "link" },
      ],
    },
    size: {
      type: "select",
      options: [
        { label: "Default", value: "default" },
        { label: "Small", value: "sm" },
        { label: "Large", value: "lg" },
        { label: "Icon", value: "icon" },
      ],
    },
  },
  defaultProps: {
    label: "Button",
    href: "#",
    variant: "default",
    size: "default",
  },
  render: ({ href, variant, label, size, puck }) => {
    // Parse template patterns if within PayloadData context
    const parsedLabel = useTemplateParsing(label);
    const parsedHref = useTemplateParsing(href);
    
    const isLink = parsedHref && parsedHref !== "#" && !puck.isEditing;
    
    return (
      <div>
        <ShadcnButton
          asChild={isLink}
          variant={variant}
          size={size}
          tabIndex={puck.isEditing ? -1 : undefined}
        >
          {isLink ? (
            <a href={parsedHref}>{parsedLabel}</a>
          ) : (
            parsedLabel
          )}
        </ShadcnButton>
      </div>
    );
  },
};
