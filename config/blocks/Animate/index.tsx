import React from "react";
import { ComponentConfig } from "@measured/puck";
import type { Slot } from "@measured/puck";

type AnimationType = "none" | "spin" | "ping" | "pulse" | "bounce";
type AnimationBehavior = "default" | "click" | "hover";

export type AnimateProps = {
  animate: AnimationType;
  behavior?: AnimationBehavior;
  children: Slot;
};

// Safelist: Declare all animation classes so Tailwind compiles them
// This ensures the animation classes are included in the final CSS bundle
// even if they're dynamically generated.
// prettier-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TAILWIND_ANIMATION_CLASSES = [
  "animate-spin",
  "animate-ping",
  "animate-pulse",
  "animate-bounce",
  "hover:animate-spin",
  "hover:animate-ping",
  "hover:animate-pulse",
  "hover:animate-bounce",
  "active:animate-spin",
  "active:animate-ping",
  "active:animate-pulse",
  "active:animate-bounce",
];

const animationClassMap: Record<Exclude<AnimationType, "none">, string> = {
  spin: "animate-spin",
  ping: "animate-ping",
  pulse: "animate-pulse",
  bounce: "animate-bounce",
};

const behaviorPrefixMap: Record<AnimationBehavior, string> = {
  default: "",
  click: "active:",
  hover: "hover:",
};

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
    behavior: {
      type: "select",
      label: "Behavior",
      options: [
        { label: "Default", value: "default" },
        { label: "On Click", value: "click" },
        { label: "On Hover", value: "hover" },
      ],
    },
    children: {
      type: "slot",
      label: "Content",
    },
  },
  defaultProps: {
    animate: "none",
    behavior: "default",
    children: [],
  },
  render: ({ animate, behavior, children: Children }) => {
    // Support legacy content that may not yet include a behavior value
    const resolvedBehavior = behavior ?? "default";
    const animationPrefix = behaviorPrefixMap[resolvedBehavior];

    if (animate === "none") {
      return <Children className="" />;
    }

    const animationClass = `${animationPrefix}${animationClassMap[animate]}`;

    return <Children className={animationClass} />;
  },
};
