import React from "react";
import { ALargeSmall, AlignLeft } from "lucide-react";
import classNames from "classnames";
import { ComponentConfig } from "@measured/puck";
import { Section } from "@/config/components/Section";
import { WithLayout, withLayout } from "@/config/components/Layout";
import { WithColor, withColor, getColorClassName, getColorStyle } from "@/config/components/Color";
import { useTemplateParsing } from "@/config/components/TemplateParsing";

export type TextProps = WithLayout<WithColor<{
  align: "left" | "center" | "right";
  text?: string;
  padding?: string;
  size?: "s" | "m";
  maxWidth?: string;
}>>;

const TextInner: ComponentConfig<TextProps> = {
  fields: {
    text: {
      type: "textarea",
      contentEditable: true,
    },
    size: {
      type: "select",
      labelIcon: <ALargeSmall size={16} />,
      options: [
        { label: "S", value: "s" },
        { label: "M", value: "m" },
      ],
    },
    align: {
      type: "radio",
      labelIcon: <AlignLeft size={16} />,
      options: [
        { label: "Left", value: "left" },
        { label: "Center", value: "center" },
        { label: "Right", value: "right" },
      ],
    },
    maxWidth: { type: "text" },
  },
  defaultProps: {
    align: "left",
    text: "Text",
    size: "m",
  },
  render: ({ align, colorType, presetColor, customColor, text, size, maxWidth }) => {
    // Parse template patterns if within PayloadData context
    const parsedText = useTemplateParsing(text);
    
    return (
      <Section maxWidth={maxWidth}>
        <span
          className={classNames(
            "flex w-full leading-normal p-0 font-light",
            size === "m" ? "text-xl" : "text-base",
            getColorClassName(colorType, presetColor),
            align === "center" && "text-center justify-center",
            align === "right" && "text-right justify-end",
            align === "left" && "text-left justify-start"
          )}
          style={{ maxWidth, ...getColorStyle(colorType, customColor, presetColor) }}
        >
          {parsedText}
        </span>
      </Section>
    );
  },
};

export const Text = withLayout(withColor(TextInner));
