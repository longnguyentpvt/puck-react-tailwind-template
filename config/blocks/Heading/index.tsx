import React from "react";
import { ComponentConfig } from "@measured/puck";

import type { HeadingProps as _HeadingProps } from "@/components/Heading";
import { Heading as _Heading } from "@/components/Heading";
import { Section } from "../../components/Section";
import { WithLayout, withLayout } from "../../components/Layout";
import { WithColor, withColor, getColorClassName, getColorStyle } from "../../components/Color";
import { WithAnimate, withAnimate, getAnimateClassName } from "../../components/Animate";


export type HeadingProps = WithLayout<WithColor<WithAnimate<{
  align: "left" | "center" | "right";
  text?: string;
  level?: _HeadingProps["rank"];
  size: _HeadingProps["size"];
}>>>;

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
  render: ({ align, text, size, level, colorType, presetColor, customColor, animate }) => {
    return (
      <Section>
        <_Heading size={size} rank={level as any}>
          <span 
            className={`${getColorClassName(colorType, presetColor)} ${getAnimateClassName(animate)}`.trim()}
            style={{ display: "block", textAlign: align, width: "100%", ...getColorStyle(colorType, customColor, presetColor) }}
          >
            {text}
          </span>
        </_Heading>
      </Section>
    );
  },
};

export const Heading = withLayout(withColor(withAnimate(HeadingInternal)));
