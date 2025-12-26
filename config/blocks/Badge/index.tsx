import React from "react";
import { ComponentConfig } from "@measured/puck";
import { Badge as ShadcnBadge } from "@/components/ui/badge";

export type BadgeProps = {
  text: string;
  variant: "default" | "secondary" | "destructive" | "outline";
  href?: string;
};

export const Badge: ComponentConfig<BadgeProps> = {
  label: "Badge",
  fields: {
    text: {
      type: "text",
      label: "Badge Text",
      placeholder: "Enter badge text...",
      contentEditable: true,
    },
    variant: {
      type: "select",
      label: "Variant",
      options: [
        { label: "Default", value: "default" },
        { label: "Secondary", value: "secondary" },
        { label: "Destructive", value: "destructive" },
        { label: "Outline", value: "outline" },
      ],
    },
    href: {
      type: "text",
      label: "Link (optional)",
      placeholder: "https://...",
    },
  },
  defaultProps: {
    text: "Badge",
    variant: "default",
    href: "",
  },
  render: ({ text, variant, href, puck }) => {
    const isLink = href && href !== "" && !puck.isEditing;
    
    return (
      <div>
        <ShadcnBadge
          asChild={isLink}
          variant={variant}
          tabIndex={puck.isEditing ? -1 : undefined}
        >
          {isLink ? (
            <a href={href}>{text}</a>
          ) : (
            text
          )}
        </ShadcnBadge>
      </div>
    );
  },
};
