import React from "react";
import { ComponentConfig } from "@measured/puck";
import type { Slot } from "@measured/puck";

type AnimationType = "none" | "spin" | "ping" | "pulse" | "bounce";
type AnimationTrigger = "default" | "hover" | "click";

export type AnimateProps = {
  animate: AnimationType;
  hoverAnimate: AnimationType;
  clickAnimate: AnimationType;
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

const triggerPrefixMap: Record<AnimationTrigger, string> = {
  default: "",
  click: "active:",
  hover: "hover:",
};

const buildAnimationClass = (trigger: AnimationTrigger, value: AnimationType) => {
  if (value === "none") return "";
  return `${triggerPrefixMap[trigger]}${animationClassMap[value]}`;
};

export const Animate: ComponentConfig<AnimateProps> = {
  label: "Animate",
  fields: {
    animate: {
      type: "select",
      label: "Default animation",
      options: [
        { label: "None", value: "none" },
        { label: "Spin", value: "spin" },
        { label: "Ping", value: "ping" },
        { label: "Pulse", value: "pulse" },
        { label: "Bounce", value: "bounce" },
      ],
    },
    hoverAnimate: {
      type: "select",
      label: "Hover animation",
      options: [
        { label: "None", value: "none" },
        { label: "Spin", value: "spin" },
        { label: "Ping", value: "ping" },
        { label: "Pulse", value: "pulse" },
        { label: "Bounce", value: "bounce" },
      ],
    },
    clickAnimate: {
      type: "select",
      label: "Click animation",
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
    hoverAnimate: "none",
    clickAnimate: "none",
    children: [],
  },
  render: ({
    animate,
    hoverAnimate,
    clickAnimate,
    children: Children,
  }) => {
    const classes: string[] = [];

    const defaultClass = buildAnimationClass("default", animate);
    const hoverClass = buildAnimationClass("hover", hoverAnimate);
    const clickClass = buildAnimationClass("click", clickAnimate);

    if (defaultClass) classes.push(defaultClass);
    if (hoverClass) classes.push(hoverClass);
    if (clickClass) classes.push(clickClass);

    if (classes.length === 0) {
      return <Children className="" />;
    }

    return <Children className={classes.join(" ")} />;
  },
};
