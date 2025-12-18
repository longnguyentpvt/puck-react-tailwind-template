import { ComponentConfig, DefaultComponentProps, ObjectField } from "@measured/puck";

export type WithColor<Props extends DefaultComponentProps> = Props & {
  colorType?: "preset" | "custom";
  presetColor?: string;
  customColor?: string;
};

export const tailwindColorOptions = [
  // Neutral colors
  { label: "Black", value: "text-black" },
  { label: "White", value: "text-white" },
  
  // Gray scale
  { label: "Gray 50", value: "text-gray-50" },
  { label: "Gray 100", value: "text-gray-100" },
  { label: "Gray 200", value: "text-gray-200" },
  { label: "Gray 300", value: "text-gray-300" },
  { label: "Gray 400", value: "text-gray-400" },
  { label: "Gray 500", value: "text-gray-500" },
  { label: "Gray 600", value: "text-gray-600" },
  { label: "Gray 700", value: "text-gray-700" },
  { label: "Gray 800", value: "text-gray-800" },
  { label: "Gray 900", value: "text-gray-900" },
  { label: "Gray 950", value: "text-gray-950" },
  
  // Slate
  { label: "Slate 500", value: "text-slate-500" },
  { label: "Slate 600", value: "text-slate-600" },
  { label: "Slate 700", value: "text-slate-700" },
  
  // Red
  { label: "Red 500", value: "text-red-500" },
  { label: "Red 600", value: "text-red-600" },
  { label: "Red 700", value: "text-red-700" },
  
  // Orange
  { label: "Orange 500", value: "text-orange-500" },
  { label: "Orange 600", value: "text-orange-600" },
  { label: "Orange 700", value: "text-orange-700" },
  
  // Amber
  { label: "Amber 500", value: "text-amber-500" },
  { label: "Amber 600", value: "text-amber-600" },
  { label: "Amber 700", value: "text-amber-700" },
  
  // Yellow
  { label: "Yellow 500", value: "text-yellow-500" },
  { label: "Yellow 600", value: "text-yellow-600" },
  { label: "Yellow 700", value: "text-yellow-700" },
  
  // Lime
  { label: "Lime 500", value: "text-lime-500" },
  { label: "Lime 600", value: "text-lime-600" },
  { label: "Lime 700", value: "text-lime-700" },
  
  // Green
  { label: "Green 500", value: "text-green-500" },
  { label: "Green 600", value: "text-green-600" },
  { label: "Green 700", value: "text-green-700" },
  
  // Emerald
  { label: "Emerald 500", value: "text-emerald-500" },
  { label: "Emerald 600", value: "text-emerald-600" },
  { label: "Emerald 700", value: "text-emerald-700" },
  
  // Teal
  { label: "Teal 500", value: "text-teal-500" },
  { label: "Teal 600", value: "text-teal-600" },
  { label: "Teal 700", value: "text-teal-700" },
  
  // Cyan
  { label: "Cyan 500", value: "text-cyan-500" },
  { label: "Cyan 600", value: "text-cyan-600" },
  { label: "Cyan 700", value: "text-cyan-700" },
  
  // Sky
  { label: "Sky 500", value: "text-sky-500" },
  { label: "Sky 600", value: "text-sky-600" },
  { label: "Sky 700", value: "text-sky-700" },
  
  // Blue
  { label: "Blue 500", value: "text-blue-500" },
  { label: "Blue 600", value: "text-blue-600" },
  { label: "Blue 700", value: "text-blue-700" },
  
  // Indigo
  { label: "Indigo 500", value: "text-indigo-500" },
  { label: "Indigo 600", value: "text-indigo-600" },
  { label: "Indigo 700", value: "text-indigo-700" },
  
  // Violet
  { label: "Violet 500", value: "text-violet-500" },
  { label: "Violet 600", value: "text-violet-600" },
  { label: "Violet 700", value: "text-violet-700" },
  
  // Purple
  { label: "Purple 500", value: "text-purple-500" },
  { label: "Purple 600", value: "text-purple-600" },
  { label: "Purple 700", value: "text-purple-700" },
  
  // Fuchsia
  { label: "Fuchsia 500", value: "text-fuchsia-500" },
  { label: "Fuchsia 600", value: "text-fuchsia-600" },
  { label: "Fuchsia 700", value: "text-fuchsia-700" },
  
  // Pink
  { label: "Pink 500", value: "text-pink-500" },
  { label: "Pink 600", value: "text-pink-600" },
  { label: "Pink 700", value: "text-pink-700" },
  
  // Rose
  { label: "Rose 500", value: "text-rose-500" },
  { label: "Rose 600", value: "text-rose-600" },
  { label: "Rose 700", value: "text-rose-700" },
];

export const presetColorOptions = [
  // CSS Variables
  { label: "Primary (CSS Variable)", value: "var-primary" },
  { label: "Secondary (CSS Variable)", value: "var-secondary" },
  { label: "Accent (CSS Variable)", value: "var-accent" },
  { label: "Text (CSS Variable)", value: "var-text" },
  { label: "Background (CSS Variable)", value: "var-background" },
  
  // Tailwind colors
  ...tailwindColorOptions,
];

export const getColorFields = () => ({
  colorType: {
    type: "radio" as const,
    label: "Color Type",
    options: [
      { label: "Preset", value: "preset" },
      { label: "Custom", value: "custom" },
    ],
  },
  presetColor: {
    type: "select" as const,
    label: "Color",
    options: presetColorOptions,
  },
  customColor: {
    type: "text" as const,
    label: "Custom Color (hex)",
  },
});

export function getColorClassName(colorType?: string, presetColor?: string): string {
  if (colorType === "preset" && presetColor && !presetColor.startsWith("var-")) {
    return presetColor;
  }
  return "";
}

export function getColorStyle(colorType?: string, customColor?: string, presetColor?: string): { color?: string } {
  if (colorType === "preset" && presetColor?.startsWith("var-")) {
    const varName = presetColor.replace("var-", "");
    return { color: `var(--color-${varName})` };
  }
  if (colorType === "custom" && customColor) {
    return { color: customColor };
  }
  return {};
}

export function withColor<
  ThisComponentConfig extends ComponentConfig<any> = ComponentConfig
>(componentConfig: ThisComponentConfig): ThisComponentConfig {
  const colorFields = getColorFields();
  
  return {
    ...componentConfig,
    fields: {
      ...colorFields,
      ...componentConfig.fields,
    },
    defaultProps: {
      ...componentConfig.defaultProps,
      colorType: componentConfig.defaultProps?.colorType || "preset",
      presetColor: componentConfig.defaultProps?.presetColor || "var-text",
      customColor: componentConfig.defaultProps?.customColor || "#000000",
    },
  };
}
