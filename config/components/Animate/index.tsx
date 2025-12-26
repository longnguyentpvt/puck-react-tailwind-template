import { ComponentConfig, DefaultComponentProps } from "@measured/puck";

export type WithAnimate<Props extends DefaultComponentProps> = Props & {
  animate?: "none" | "spin" | "ping" | "pulse" | "bounce";
};

export const animateOptions = [
  { label: "None", value: "none" },
  { label: "Spin", value: "spin" },
  { label: "Ping", value: "ping" },
  { label: "Pulse", value: "pulse" },
  { label: "Bounce", value: "bounce" },
];

export function getAnimateClassName(animate?: string): string {
  if (!animate || animate === "none") {
    return "";
  }
  return `animate-${animate}`;
}

// Safelist: Declare all animation classes so Tailwind compiles them
// prettier-ignore
const TAILWIND_ANIMATION_CLASSES = [
  'animate-spin',
  'animate-ping',
  'animate-pulse',
  'animate-bounce',
];

export function withAnimate<
  ThisComponentConfig extends ComponentConfig<any> = ComponentConfig
>(componentConfig: ThisComponentConfig): ThisComponentConfig {
  return {
    ...componentConfig,
    fields: {
      ...componentConfig.fields,
      animate: {
        type: "select",
        label: "Animation",
        options: animateOptions,
      },
    },
    defaultProps: {
      ...componentConfig.defaultProps,
      animate: componentConfig.defaultProps?.animate || "none",
    },
  };
}
