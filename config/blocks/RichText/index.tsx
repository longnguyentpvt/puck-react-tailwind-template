import React from "react";
import { ComponentConfig } from "@measured/puck";
import { WithLayout, withLayout } from "@/config/components/Layout";
import { Section } from "@/config/components/Section";

export type RichTextProps = WithLayout<{
  richtext?: string;
}>;

const RichTextInner: ComponentConfig<RichTextProps> = {
  fields: {
    richtext: {
      type: "textarea",
    },
  },
  render: ({ richtext }) => {
    return <Section>{richtext}</Section>;
  },
  defaultProps: {
    richtext: "<h2>Heading</h2><p>Body</p>",
  },
};

export const RichText = withLayout(RichTextInner);
