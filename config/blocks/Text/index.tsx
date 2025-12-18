import React from "react";
import { ALargeSmall, AlignLeft } from "lucide-react";
import classNames from "classnames";
import { ComponentConfig } from "@measured/puck";
import { Section } from "@/config/components/Section";
import { WithLayout, withLayout } from "@/config/components/Layout";

export type TextProps = WithLayout<{
  align: "left" | "center" | "right";
  text?: string;
  padding?: string;
  size?: "s" | "m";
  color: "default" | "muted";
  maxWidth?: string;
}>;

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
    color: {
      type: "radio",
      options: [
        { label: "Default", value: "default" },
        { label: "Muted", value: "muted" },
      ],
    },
    maxWidth: { type: "text" },
  },
  defaultProps: {
    align: "left",
    text: "Text",
    size: "m",
    color: "default",
  },
  render: ({ align, color, text, size, maxWidth }) => {
    return (
      <Section maxWidth={maxWidth}>
        <span
          className={classNames(
            "flex w-full leading-normal p-0 font-light",
            size === "m" ? "text-xl" : "text-base",
            color === "muted" && "text-gray-600",
            align === "center" && "text-center justify-center",
            align === "right" && "text-right justify-end",
            align === "left" && "text-left justify-start"
          )}
          style={{ maxWidth }}
        >
          {text}
        </span>
      </Section>
    );
  },
};

export const Text = withLayout(TextInner);
