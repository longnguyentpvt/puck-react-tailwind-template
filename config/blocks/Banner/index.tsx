import React from "react";
import { ComponentConfig } from "@measured/puck";
import type { Slot } from "@measured/puck";
import { WithLayout, withLayout } from "@/config/components/Layout";

// Gradient color options using Tailwind colors
const gradientColorOptions = [
  // Transparent options
  { label: "Transparent", value: "transparent" },
  
  // Black/White with opacity
  { label: "Black", value: "rgb(0 0 0)" },
  { label: "Black 90%", value: "rgb(0 0 0 / 0.9)" },
  { label: "Black 80%", value: "rgb(0 0 0 / 0.8)" },
  { label: "Black 70%", value: "rgb(0 0 0 / 0.7)" },
  { label: "Black 60%", value: "rgb(0 0 0 / 0.6)" },
  { label: "Black 50%", value: "rgb(0 0 0 / 0.5)" },
  { label: "Black 40%", value: "rgb(0 0 0 / 0.4)" },
  { label: "Black 30%", value: "rgb(0 0 0 / 0.3)" },
  { label: "Black 20%", value: "rgb(0 0 0 / 0.2)" },
  { label: "Black 10%", value: "rgb(0 0 0 / 0.1)" },
  
  { label: "White", value: "rgb(255 255 255)" },
  { label: "White 90%", value: "rgb(255 255 255 / 0.9)" },
  { label: "White 80%", value: "rgb(255 255 255 / 0.8)" },
  { label: "White 70%", value: "rgb(255 255 255 / 0.7)" },
  { label: "White 60%", value: "rgb(255 255 255 / 0.6)" },
  { label: "White 50%", value: "rgb(255 255 255 / 0.5)" },
  { label: "White 40%", value: "rgb(255 255 255 / 0.4)" },
  { label: "White 30%", value: "rgb(255 255 255 / 0.3)" },
  { label: "White 20%", value: "rgb(255 255 255 / 0.2)" },
  { label: "White 10%", value: "rgb(255 255 255 / 0.1)" },
  
  // Tailwind Gray scale
  { label: "Gray 900", value: "rgb(17 24 39)" },
  { label: "Gray 800", value: "rgb(31 41 55)" },
  { label: "Gray 700", value: "rgb(55 65 81)" },
  { label: "Gray 600", value: "rgb(75 85 99)" },
  { label: "Gray 500", value: "rgb(107 114 128)" },
  { label: "Gray 400", value: "rgb(156 163 175)" },
  { label: "Gray 300", value: "rgb(209 213 219)" },
  { label: "Gray 200", value: "rgb(229 231 235)" },
  { label: "Gray 100", value: "rgb(243 244 246)" },
  
  // Tailwind Blue
  { label: "Blue 900", value: "rgb(30 58 138)" },
  { label: "Blue 800", value: "rgb(30 64 175)" },
  { label: "Blue 700", value: "rgb(29 78 216)" },
  { label: "Blue 600", value: "rgb(37 99 235)" },
  { label: "Blue 500", value: "rgb(59 130 246)" },
  { label: "Blue 400", value: "rgb(96 165 250)" },
  
  // Tailwind Red
  { label: "Red 900", value: "rgb(127 29 29)" },
  { label: "Red 800", value: "rgb(153 27 27)" },
  { label: "Red 700", value: "rgb(185 28 28)" },
  { label: "Red 600", value: "rgb(220 38 38)" },
  { label: "Red 500", value: "rgb(239 68 68)" },
  
  // Tailwind Green
  { label: "Green 900", value: "rgb(20 83 45)" },
  { label: "Green 800", value: "rgb(22 101 52)" },
  { label: "Green 700", value: "rgb(21 128 61)" },
  { label: "Green 600", value: "rgb(22 163 74)" },
  { label: "Green 500", value: "rgb(34 197 94)" },
  
  // Tailwind Purple
  { label: "Purple 900", value: "rgb(88 28 135)" },
  { label: "Purple 800", value: "rgb(107 33 168)" },
  { label: "Purple 700", value: "rgb(126 34 206)" },
  { label: "Purple 600", value: "rgb(147 51 234)" },
  { label: "Purple 500", value: "rgb(168 85 247)" },
  
  // Tailwind Orange
  { label: "Orange 900", value: "rgb(124 45 18)" },
  { label: "Orange 800", value: "rgb(154 52 18)" },
  { label: "Orange 700", value: "rgb(194 65 12)" },
  { label: "Orange 600", value: "rgb(234 88 12)" },
  { label: "Orange 500", value: "rgb(249 115 22)" },
];

export type BannerProps = WithLayout<{
  backgroundType: "image" | "color";
  backgroundImage?: string;
  backgroundSize?: "cover" | "contain" | "auto";
  backgroundPosition?: "center" | "top" | "bottom" | "left" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
  backgroundColor?: string;
  overlayEnabled: boolean;
  overlayType: "solid" | "gradient";
  overlayColor: "dark" | "light";
  overlayOpacity: number;
  overlayGradientDirection?: "to-top" | "to-bottom" | "to-left" | "to-right" | "to-top-right" | "to-bottom-right" | "to-top-left" | "to-bottom-left";
  overlayGradientFrom?: string;
  overlayGradientTo?: string;
  height: "small" | "medium" | "large" | "full";
  contentAlign: "left" | "center" | "right";
  contentVerticalAlign: "top" | "center" | "bottom";
  contentMaxWidth: "full" | "7xl" | "6xl" | "5xl" | "4xl" | "3xl" | "2xl" | "xl" | "lg" | "md" | "sm";
  contentPadding: string;
  content: Slot;
}>;

const BannerInner: ComponentConfig<BannerProps> = {
  label: "Banner",
  fields: {
    backgroundType: {
      type: "radio",
      label: "Background Type",
      options: [
        { label: "Image", value: "image" },
        { label: "Color", value: "color" },
      ],
    },
    backgroundImage: {
      type: "text",
      label: "Background Image URL",
    },
    backgroundSize: {
      type: "select",
      label: "Background Size",
      options: [
        { label: "Cover", value: "cover" },
        { label: "Contain", value: "contain" },
        { label: "Auto", value: "auto" },
      ],
    },
    backgroundPosition: {
      type: "select",
      label: "Background Position",
      options: [
        { label: "Center", value: "center" },
        { label: "Top", value: "top" },
        { label: "Bottom", value: "bottom" },
        { label: "Left", value: "left" },
        { label: "Right", value: "right" },
        { label: "Top Left", value: "top-left" },
        { label: "Top Right", value: "top-right" },
        { label: "Bottom Left", value: "bottom-left" },
        { label: "Bottom Right", value: "bottom-right" },
      ],
    },
    backgroundColor: {
      type: "text",
      label: "Background Color",
    },
    overlayEnabled: {
      type: "radio",
      label: "Enable Overlay",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    overlayType: {
      type: "radio",
      label: "Overlay Type",
      options: [
        { label: "Solid", value: "solid" },
        { label: "Gradient", value: "gradient" },
      ],
    },
    overlayColor: {
      type: "radio",
      label: "Overlay Color",
      options: [
        { label: "Dark", value: "dark" },
        { label: "Light", value: "light" },
      ],
    },
    overlayOpacity: {
      type: "select",
      label: "Overlay Opacity",
      options: [
        { label: "10%", value: 0.1 },
        { label: "20%", value: 0.2 },
        { label: "30%", value: 0.3 },
        { label: "40%", value: 0.4 },
        { label: "50%", value: 0.5 },
        { label: "60%", value: 0.6 },
        { label: "70%", value: 0.7 },
        { label: "80%", value: 0.8 },
      ],
    },
    overlayGradientDirection: {
      type: "select",
      label: "Gradient Direction",
      options: [
        { label: "To Top", value: "to-top" },
        { label: "To Bottom", value: "to-bottom" },
        { label: "To Left", value: "to-left" },
        { label: "To Right", value: "to-right" },
        { label: "To Top Right", value: "to-top-right" },
        { label: "To Bottom Right", value: "to-bottom-right" },
        { label: "To Top Left", value: "to-top-left" },
        { label: "To Bottom Left", value: "to-bottom-left" },
      ],
    },
    overlayGradientFrom: {
      type: "select",
      label: "Gradient Start Color",
      options: gradientColorOptions,
    },
    overlayGradientTo: {
      type: "select",
      label: "Gradient End Color",
      options: gradientColorOptions,
    },
    height: {
      type: "select",
      label: "Height",
      options: [
        { label: "Small (300px)", value: "small" },
        { label: "Medium (500px)", value: "medium" },
        { label: "Large (700px)", value: "large" },
        { label: "Full Screen", value: "full" },
      ],
    },
    contentAlign: {
      type: "radio",
      label: "Horizontal Alignment",
      options: [
        { label: "Left", value: "left" },
        { label: "Center", value: "center" },
        { label: "Right", value: "right" },
      ],
    },
    contentVerticalAlign: {
      type: "radio",
      label: "Vertical Alignment",
      options: [
        { label: "Top", value: "top" },
        { label: "Center", value: "center" },
        { label: "Bottom", value: "bottom" },
      ],
    },
    contentMaxWidth: {
      type: "select",
      label: "Content Max Width",
      options: [
        { label: "Full", value: "full" },
        { label: "7XL (1280px)", value: "7xl" },
        { label: "6XL (1152px)", value: "6xl" },
        { label: "5XL (1024px)", value: "5xl" },
        { label: "4XL (896px)", value: "4xl" },
        { label: "3XL (768px)", value: "3xl" },
        { label: "2XL (672px)", value: "2xl" },
        { label: "XL (576px)", value: "xl" },
        { label: "LG (512px)", value: "lg" },
        { label: "MD (448px)", value: "md" },
        { label: "SM (384px)", value: "sm" },
      ],
    },
    contentPadding: {
      type: "select",
      label: "Content Padding",
      options: [
        { label: "None", value: "0" },
        { label: "XS (4px)", value: "1" },
        { label: "SM (8px)", value: "2" },
        { label: "MD (12px)", value: "3" },
        { label: "LG (16px)", value: "4" },
        { label: "XL (24px)", value: "6" },
        { label: "2XL (32px)", value: "8" },
        { label: "3XL (48px)", value: "12" },
        { label: "4XL (64px)", value: "16" },
      ],
    },
    content: {
      type: "slot",
      label: "Content",
    },
  },
  defaultProps: {
    backgroundType: "image",
    backgroundImage: "https://images.unsplash.com/photo-1557683316-973673baf926",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundColor: "#3b82f6",
    overlayEnabled: true,
    overlayType: "solid",
    overlayColor: "dark",
    overlayOpacity: 0.4,
    overlayGradientDirection: "to-bottom",
    overlayGradientFrom: "rgb(0 0 0 / 0.8)",
    overlayGradientTo: "rgb(0 0 0 / 0.2)",
    height: "medium",
    contentAlign: "center",
    contentVerticalAlign: "center",
    contentMaxWidth: "5xl",
    contentPadding: "6",
    content: [],
  },
  render: ({
    backgroundType,
    backgroundImage,
    backgroundSize,
    backgroundPosition,
    backgroundColor,
    overlayEnabled,
    overlayType,
    overlayColor,
    overlayOpacity,
    overlayGradientDirection,
    overlayGradientFrom,
    overlayGradientTo,
    height,
    contentAlign,
    contentVerticalAlign,
    contentMaxWidth,
    contentPadding,
    content: Content,
  }) => {
    const heightClass = {
      small: "h-75",
      medium: "h-125",
      large: "h-175",
      full: "h-screen",
    }[height];

    const alignItemsClass = {
      top: "items-start",
      center: "items-center",
      bottom: "items-end",
    }[contentVerticalAlign];

    const justifyContentClass = {
      left: "justify-start",
      center: "justify-center",
      right: "justify-end",
    }[contentAlign];

    const maxWidthClass = `max-w-${contentMaxWidth}`;
    const paddingClass = `p-${contentPadding}`;

    // Convert background position value to CSS format
    const backgroundPositionMap: { [key: string]: string } = {
      "center": "center",
      "top": "top",
      "bottom": "bottom",
      "left": "left",
      "right": "right",
      "top-left": "top left",
      "top-right": "top right",
      "bottom-left": "bottom left",
      "bottom-right": "bottom right",
    };

    const backgroundStyle =
      backgroundType === "image"
        ? {
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: backgroundSize || "cover",
            backgroundPosition: backgroundPositionMap[backgroundPosition || "center"] || "center",
            backgroundRepeat: "no-repeat",
          }
        : {
            backgroundColor: backgroundColor,
          };

    // Convert gradient direction to CSS linear-gradient direction
    const gradientDirectionMap: { [key: string]: string } = {
      "to-top": "to top",
      "to-bottom": "to bottom",
      "to-left": "to left",
      "to-right": "to right",
      "to-top-right": "to top right",
      "to-bottom-right": "to bottom right",
      "to-top-left": "to top left",
      "to-bottom-left": "to bottom left",
    };

    // Calculate overlay style based on type
    const getOverlayStyle = () => {
      if (!overlayEnabled) return {};
      
      if (overlayType === "gradient") {
        const direction = gradientDirectionMap[overlayGradientDirection || "to-bottom"] || "to bottom";
        const fromColor = overlayGradientFrom || "rgb(0 0 0 / 0.8)";
        const toColor = overlayGradientTo || "rgb(0 0 0 / 0.2)";
        
        return {
          backgroundImage: `linear-gradient(${direction}, ${fromColor}, ${toColor})`,
          opacity: overlayOpacity,
        };
      } else {
        // Solid overlay
        return {
          backgroundColor: overlayColor === "dark" ? "#000000" : "#ffffff",
          opacity: overlayOpacity,
        };
      }
    };

    return (
      <div
        className={`relative w-full ${heightClass} overflow-hidden`}
        style={backgroundStyle}
      >
        {overlayEnabled && (
          <div
            className="absolute inset-0"
            style={getOverlayStyle()}
          />
        )}
        <div
          className={`relative h-full flex ${alignItemsClass} ${justifyContentClass} ${paddingClass}`}
        >
          <div className={`w-full ${maxWidthClass}`}>
            <Content />
          </div>
        </div>
      </div>
    );
  },
};

export const Banner = withLayout(BannerInner);
