import React, { useMemo } from "react";
import { ComponentConfig } from "@measured/puck";

import type { HeadingProps as _HeadingProps } from "@/components/Heading";
import { Heading as _Heading } from "@/components/Heading";
import { Section } from "../../components/Section";
import { WithLayout, withLayout } from "../../components/Layout";
import { WithColor, withColor, getColorClassName, getColorStyle } from "../../components/Color";
import { useDataContext } from "@/config/contexts/DataContext";
import { processTemplate } from "@/config/utils/template-processor";


export type HeadingProps = WithLayout<WithColor<{
  align: "left" | "center" | "right";
  text?: string;
  level?: _HeadingProps["rank"];
  size: _HeadingProps["size"];
}>>;

const sizeOptions = [
  { value: "xxxl", label: "XXXL" },
  { value: "xxl", label: "XXL" },
  { value: "xl", label: "XL" },
  { value: "l", label: "L" },
  { value: "m", label: "M" },
  { value: "s", label: "S" },
  { value: "xs", label: "XS" },
];

const levelOptions = [
  { label: "", value: "" },
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
  { label: "5", value: "5" },
  { label: "6", value: "6" },
];

const HeadingInternal: ComponentConfig<HeadingProps> = {
  fields: {
    text: {
      type: "textarea",
      contentEditable: true,
    },
    size: {
      type: "select",
      options: sizeOptions,
    },
    level: {
      type: "select",
      options: levelOptions,
    },
    align: {
      type: "radio",
      options: [
        { label: "Left", value: "left" },
        { label: "Center", value: "center" },
        { label: "Right", value: "right" },
      ],
    },
  },
  defaultProps: {
    align: "left",
    text: "Heading",
    size: "m",
    layout: {
      paddingTop: "2",
      paddingBottom: "2",
    },
  },
  render: ({ align, text, size, level, colorType, presetColor, customColor }) => {
    // Get data from context if available
    const dataContext = useDataContext();
    
    // Process template syntax if data is available
    // Memoize to avoid unnecessary processing on every render
    const processedText = useMemo(() => {
      return dataContext?.data 
        ? processTemplate(text, dataContext.data)
        : text;
    }, [text, dataContext?.data]);
    
    return (
      <Section>
        <_Heading size={size} rank={level as any}>
          <span 
            className={getColorClassName(colorType, presetColor)}
            style={{ display: "block", textAlign: align, width: "100%", ...getColorStyle(colorType, customColor, presetColor) }}
          >
            {processedText}
          </span>
        </_Heading>
      </Section>
    );
  },
};

export const Heading = withLayout(withColor(HeadingInternal));
