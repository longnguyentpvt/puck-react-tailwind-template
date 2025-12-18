"use client";

import React from "react";
import { ComponentConfig } from "@measured/puck";
import type { Slot } from "@measured/puck";
import { WithLayout, withLayout } from "@/config/components/Layout";

export type BannerProps = WithLayout<{
  backgroundType: "image" | "color";
  backgroundImage?: string;
  backgroundColor?: string;
  overlayEnabled: boolean;
  overlayColor: "dark" | "light";
  overlayOpacity: number;
  height: "small" | "medium" | "large" | "full";
  contentAlign: "left" | "center" | "right";
  contentVerticalAlign: "top" | "center" | "bottom";
  contentMaxWidth: "full" | "large" | "medium" | "small";
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
        { label: "Large (1200px)", value: "large" },
        { label: "Medium (800px)", value: "medium" },
        { label: "Small (600px)", value: "small" },
      ],
    },
    contentPadding: {
      type: "text",
      label: "Content Padding",
    },
    content: {
      type: "slot",
      label: "Content",
    },
  },
  defaultProps: {
    backgroundType: "image",
    backgroundImage: "https://images.unsplash.com/photo-1557683316-973673baf926",
    backgroundColor: "#3b82f6",
    overlayEnabled: true,
    overlayColor: "dark",
    overlayOpacity: 0.4,
    height: "medium",
    contentAlign: "center",
    contentVerticalAlign: "center",
    contentMaxWidth: "large",
    contentPadding: "24px",
    content: [],
  },
  render: ({
    backgroundType,
    backgroundImage,
    backgroundColor,
    overlayEnabled,
    overlayColor,
    overlayOpacity,
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

    const maxWidthClass = {
      full: "max-w-full",
      large: "max-w-300",
      medium: "max-w-200",
      small: "max-w-150",
    }[contentMaxWidth];

    const backgroundStyle =
      backgroundType === "image"
        ? {
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }
        : {
            backgroundColor: backgroundColor,
          };

    return (
      <div
        className={`relative w-full ${heightClass} overflow-hidden`}
        style={backgroundStyle}
      >
        {overlayEnabled && (
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: overlayColor === "dark" ? "#000000" : "#ffffff",
              opacity: overlayOpacity,
            }}
          />
        )}
        <div
          className={`relative h-full flex ${alignItemsClass} ${justifyContentClass} px-4 md:px-8`}
          style={{ padding: contentPadding }}
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
