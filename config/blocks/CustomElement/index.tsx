import React from "react";
import { ComponentConfig } from "@measured/puck";
import type { Slot } from "@measured/puck";
import { Section } from "../../components/Section";
import { WithLayout, withLayout } from "../../components/Layout";

export type CustomElementProps = WithLayout<{
  element: "div" | "span" | "section" | "article" | "aside" | "header" | "footer" | "nav" | "main";
  children: Slot;
  customClasses?: string;
}>;

// Basic validation to ensure classes look reasonable
// Allows: alphanumeric, hyphens, underscores, colons (for pseudo-classes), 
// slashes (for fractions like w-1/2), brackets (for arbitrary values),
// and spaces (to separate multiple classes)
const isValidClassString = (classes: string): boolean => {
  // Allow empty string
  if (!classes) return true;
  
  // Check if it only contains valid characters for CSS classes
  // This is a basic check, not a complete CSS validator
  const validPattern = /^[a-zA-Z0-9\s\-_:\/\[\]\.#%]+$/;
  return validPattern.test(classes);
};

const CustomElementInternal: ComponentConfig<CustomElementProps> = {
  fields: {
    element: {
      type: "select",
      label: "HTML Element",
      options: [
        { label: "Div", value: "div" },
        { label: "Span", value: "span" },
        { label: "Section", value: "section" },
        { label: "Article", value: "article" },
        { label: "Aside", value: "aside" },
        { label: "Header", value: "header" },
        { label: "Footer", value: "footer" },
        { label: "Nav", value: "nav" },
        { label: "Main", value: "main" },
      ],
    },
    children: {
      type: "slot",
      label: "Content",
    },
    customClasses: {
      type: "textarea",
      label: "Custom Tailwind Classes",
      placeholder: "e.g., bg-blue-500 text-white p-4 rounded-lg shadow-md",
    },
  },
  defaultProps: {
    element: "div",
    children: [],
    customClasses: "p-4 bg-gray-100 rounded",
    layout: {
      paddingTop: "0",
      paddingBottom: "0",
    },
  },
  render: ({ element, children: Children, customClasses }) => {
    const Element = element;
    // Basic validation - in production, you may want to implement
    // more strict validation or use a CSS class whitelist for untrusted users
    const safeClasses = isValidClassString(customClasses || "") ? customClasses : "";

    return (
      <Section>
        <Element className={`${safeClasses || ""} w-full`}>
          <Children className="w-full" />
        </Element>
      </Section>
    );
  },
};

export const CustomElement = withLayout(CustomElementInternal);
