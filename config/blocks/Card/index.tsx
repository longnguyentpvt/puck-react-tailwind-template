/* eslint-disable @next/next/no-img-element */
import React, { ReactElement } from "react";
import { ComponentConfig } from "@measured/puck";
import type { Slot } from "@measured/puck";
import dynamic from "next/dynamic";
import dynamicIconImports from "lucide-react/dynamicIconImports";
import { withLayout, WithLayout } from "../../components/Layout";
import {
  Card as ShadcnCard,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "@/components/ui/card";

const icons = Object.keys(dynamicIconImports).reduce<
  Record<string, ReactElement>
>((acc, iconName) => {
  const El = dynamic((dynamicIconImports as any)[iconName]);

  return {
    ...acc,
    [iconName]: <El />,
  };
}, {});

const iconOptions = Object.keys(dynamicIconImports).map((iconName) => ({
  label: iconName,
  value: iconName,
}));

export type CardProps = WithLayout<{
  header: Slot;
  content: Slot;
  footer: Slot;
  icon?: string;
  mode: "flat" | "card";
  showIcon?: boolean;
  iconPosition?: "left" | "top";
  showHeader?: boolean;
  showContent?: boolean;
  showFooter?: boolean;
  actionText?: string;
  actionHref?: string;
  showAction?: boolean;
  href?: string;
  variant?: "default" | "bordered" | "elevated";
}>;

const CardInner: ComponentConfig<CardProps> = {
  fields: {
    showHeader: {
      type: "radio",
      label: "Show Header Section",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    header: {
      type: "slot",
      label: "Header Content (Title/Description)",
    },
    mode: {
      type: "radio",
      label: "Mode",
      options: [
        { label: "Card", value: "card" },
        { label: "Flat", value: "flat" },
      ],
    },
    variant: {
      type: "select",
      label: "Style Variant",
      options: [
        { label: "Default", value: "default" },
        { label: "Bordered", value: "bordered" },
        { label: "Elevated", value: "elevated" },
      ],
    },
    showIcon: {
      type: "radio",
      label: "Show Icon",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    icon: {
      type: "select",
      label: "Icon",
      options: iconOptions,
    },
    iconPosition: {
      type: "radio",
      label: "Icon Position",
      options: [
        { label: "Left", value: "left" },
        { label: "Top", value: "top" },
      ],
    },
    showContent: {
      type: "radio",
      label: "Show Content Section",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    content: {
      type: "slot",
      label: "Content",
    },
    showFooter: {
      type: "radio",
      label: "Show Footer",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    footer: {
      type: "slot",
      label: "Footer Content",
    },
    showAction: {
      type: "radio",
      label: "Show Action Button",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    actionText: {
      type: "text",
      label: "Action Button Text",
    },
    actionHref: {
      type: "text",
      label: "Action Button Link",
    },
    href: {
      type: "text",
      label: "Card Link (entire card clickable)",
    },
  },
  defaultProps: {
    header: [],
    content: [],
    footer: [],
    icon: "Feather",
    mode: "flat",
    showIcon: true,
    iconPosition: "left",
    showHeader: true,
    showContent: false,
    showFooter: false,
    showAction: false,
    actionText: "Learn More",
    actionHref: "#",
    href: "",
    variant: "default",
  },
  render: ({ 
    header: Header,
    icon, 
    mode, 
    showIcon = true,
    iconPosition = "left",
    content: Content,
    showHeader = true,
    showContent = false,
    footer: Footer,
    showFooter = false,
    actionText,
    actionHref,
    showAction = false,
    href,
    variant = "default",
    puck,
  }) => {
    const isEditMode = puck.isEditing;
    
    const variantClasses = {
      default: "",
      bordered: "border-2",
      elevated: "shadow-lg",
    };

    const iconElement = showIcon && icon && (
      <div className="rounded-full bg-blue-100 text-blue-600 flex justify-center items-center w-12 h-12 shrink-0">
        {icons[icon]}
      </div>
    );

    const CardWrapper = ({ children }: { children: React.ReactNode }) => {
      if (href) {
        return (
          <a href={href} className="block h-full no-underline">
            {children}
          </a>
        );
      }
      return <>{children}</>;
    };

    // Edit mode with clear drop zones
    if (isEditMode) {
      return (
        <div className="border-2 border-dashed border-blue-300 rounded-lg p-4">
          <div className="text-xs font-medium text-blue-600 mb-4 bg-blue-50 p-2 rounded">
            Card Editor - Drop components into Header, Content, or Footer areas
          </div>
          <CardWrapper>
            <ShadcnCard className={`h-full ${variantClasses[variant]}`}>
              {showHeader && (
                <CardHeader>
                  {showAction && actionText && (
                    <CardAction>
                      <a href={actionHref} className="text-sm text-blue-600 hover:text-blue-800">
                        {actionText}
                      </a>
                    </CardAction>
                  )}
                  <div className="flex items-start gap-4">
                    {iconElement}
                    <div className="flex-1 min-h-20 border border-dashed border-gray-300 rounded p-2">
                      <div className="text-xs text-gray-500 mb-2">Header Area (drop Title, Text, or other components):</div>
                      <Header />
                    </div>
                  </div>
                </CardHeader>
              )}
              {showContent && (
                <CardContent>
                  <div className="min-h-20 border border-dashed border-gray-300 rounded p-2">
                    <div className="text-xs text-gray-500 mb-2">Content Area:</div>
                    <Content />
                  </div>
                </CardContent>
              )}
              {showFooter && (
                <CardFooter>
                  <div className="min-h-[60px] border border-dashed border-gray-300 rounded p-2 flex-1">
                    <div className="text-xs text-gray-500 mb-2">Footer Area:</div>
                    <Footer />
                  </div>
                </CardFooter>
              )}
            </ShadcnCard>
          </CardWrapper>
        </div>
      );
    }

    // Normal render mode for flat card style
    if (mode === "flat") {
      return (
        <CardWrapper>
          <div className="h-full flex flex-col items-center gap-4 text-center">
            {iconElement}
            {showHeader && (
              <div className="w-full">
                <Header />
              </div>
            )}
            {showContent && (
              <div className="w-full">
                <Content />
              </div>
            )}
            {showFooter && (
              <div className="w-full mt-auto pt-4">
                <Footer />
              </div>
            )}
          </div>
        </CardWrapper>
      );
    }

    // Normal render mode for card style
    return (
      <CardWrapper>
        <ShadcnCard className={`h-full ${variantClasses[variant]}`}>
          {showHeader && (
            <CardHeader>
              {showAction && actionText && (
                <CardAction>
                  <a href={actionHref} className="text-sm text-blue-600 hover:text-blue-800">
                    {actionText}
                  </a>
                </CardAction>
              )}
              {iconPosition === "top" ? (
                <div className="flex flex-col items-start gap-3">
                  {iconElement}
                  <div className="w-full">
                    <Header />
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-4">
                  {iconElement}
                  <div className="flex-1">
                    <Header />
                  </div>
                </div>
              )}
            </CardHeader>
          )}
          {showContent && (
            <CardContent>
              <Content />
            </CardContent>
          )}
          {showFooter && (
            <CardFooter>
              <Footer />
            </CardFooter>
          )}
        </ShadcnCard>
      </CardWrapper>
    );
  },
};

export const Card = withLayout(CardInner);
