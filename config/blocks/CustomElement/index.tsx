import React from "react";
import { ComponentConfig } from "@measured/puck";
import { Section } from "../../components/Section";
import { WithLayout, withLayout } from "../../components/Layout";

export type CustomElementProps = WithLayout<{
  element: "div" | "span" | "section" | "article" | "aside" | "header" | "footer" | "nav" | "main";
  content?: string;
  customClasses?: string;
}>;

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
    content: {
      type: "textarea",
      label: "Content",
      contentEditable: true,
    },
    customClasses: {
      type: "textarea",
      label: "Custom Tailwind Classes",
      placeholder: "e.g., bg-blue-500 text-white p-4 rounded-lg shadow-md",
    },
  },
  defaultProps: {
    element: "div",
    content: "Custom Element",
    customClasses: "p-4 bg-gray-100 rounded",
    layout: {
      paddingTop: "0",
      paddingBottom: "0",
    },
  },
  render: ({ element, content, customClasses }) => {
    const Element = element;

    return (
      <Section>
        <Element className={customClasses || ""}>
          {content}
        </Element>
      </Section>
    );
  },
};

export const CustomElement = withLayout(CustomElementInternal);
