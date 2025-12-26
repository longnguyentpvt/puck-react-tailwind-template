import React from "react";
import { ComponentConfig } from "@measured/puck";
import type { Slot } from "@measured/puck";
import classNames from "classnames";
import { Section } from "@/config/components/Section";

export type AnimateProps = {
  animate: "none" | "spin" | "ping" | "pulse" | "bounce";
  children: Slot;
};

// Safelist: Declare all animation classes so Tailwind compiles them
// This ensures the animation classes are included in the final CSS bundle
// even if they're dynamically generated.
// prettier-ignore
const TAILWIND_ANIMATION_CLASSES = [
  'animate-spin',
  'animate-ping',
  'animate-pulse',
  'animate-bounce',
];

export const Animate: ComponentConfig<AnimateProps> = {
  label: "Animate",
  fields: {
    animate: {
      type: "select",
      label: "Animation",
      options: [
        { label: "None", value: "none" },
        { label: "Spin", value: "spin" },
        { label: "Ping", value: "ping" },
        { label: "Pulse", value: "pulse" },
        { label: "Bounce", value: "bounce" },
      ],
    },
    children: {
      type: "slot",
      label: "Content",
    },
  },
  defaultProps: {
    animate: "none",
    children: [],
  },
  render: ({ animate, children: Children }) => {
    const animateClass = animate !== "none" ? `animate-${animate}` : "";

    return (
      <Section>
        <Children
          className={classNames(animateClass)}
        />
      </Section>
    );
  },
};
