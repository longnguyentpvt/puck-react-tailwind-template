import React from "react";
import { ComponentConfig } from "@measured/puck";
import type { Slot } from "@measured/puck";
import { WithLayout, withLayout } from "@/config/components/Layout";

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
      type: "text",
      label: "Gradient Start Color (hex or rgba)",
    },
    overlayGradientTo: {
      type: "text",
      label: "Gradient End Color (hex or rgba)",
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
    overlayGradientFrom: "rgba(0, 0, 0, 0.8)",
    overlayGradientTo: "rgba(0, 0, 0, 0.2)",
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
    backgroundSize = "cover",
    backgroundPosition = "center",
    backgroundColor,
    overlayEnabled,
    overlayType = "solid",
    overlayColor,
    overlayOpacity,
    overlayGradientDirection = "to-bottom",
    overlayGradientFrom = "rgba(0, 0, 0, 0.8)",
    overlayGradientTo = "rgba(0, 0, 0, 0.2)",
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
            backgroundSize: backgroundSize,
            backgroundPosition: backgroundPositionMap[backgroundPosition] || "center",
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
        const direction = gradientDirectionMap[overlayGradientDirection] || "to bottom";
        return {
          backgroundImage: `linear-gradient(${direction}, ${overlayGradientFrom}, ${overlayGradientTo})`,
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
