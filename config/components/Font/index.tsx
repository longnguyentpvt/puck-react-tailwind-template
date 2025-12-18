import { ComponentConfig } from "@measured/puck";

export type WithFont<Props> = Props & {
  fontFamily?: string;
};

export const fontFamilyOptions = [
  { label: "System Default", value: "sans" },
  { label: "System Sans-serif", value: "sans" },
  { label: "System Serif", value: "serif" },
  { label: "System Mono", value: "mono" },
  { label: "Inter", value: "inter" },
  { label: "Roboto", value: "roboto" },
  { label: "Open Sans", value: "open-sans" },
  { label: "Lato", value: "lato" },
  { label: "Montserrat", value: "montserrat" },
  { label: "Poppins", value: "poppins" },
  { label: "Raleway", value: "raleway" },
  { label: "Nunito", value: "nunito" },
  { label: "Playfair Display", value: "playfair-display" },
  { label: "Merriweather", value: "merriweather" },
  { label: "Lora", value: "lora" },
  { label: "PT Serif", value: "pt-serif" },
  { label: "Bebas Neue", value: "bebas-neue" },
  { label: "Oswald", value: "oswald" },
  { label: "Archivo Black", value: "archivo-black" },
];

export function getFontFields() {
  return {
    fontFamily: {
      type: "select" as const,
      label: "Font Family",
      options: fontFamilyOptions,
    },
  };
}

export function getFontClassName(fontFamily?: string): string {
  if (!fontFamily) return "";
  return `font-${fontFamily}`;
}

export function withFont<Config extends ComponentConfig<any>>(
  config: Config
): Config {
  return {
    ...config,
    fields: {
      ...config.fields,
      ...getFontFields(),
    },
  } as Config;
}
