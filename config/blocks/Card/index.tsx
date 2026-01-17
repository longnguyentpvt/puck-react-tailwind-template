/* eslint-disable @next/next/no-img-element */
import React, { ReactElement } from "react";
import { ComponentConfig } from "@measured/puck";
import dynamic from "next/dynamic";
import dynamicIconImports from "lucide-react/dynamicIconImports";
import { withLayout, WithLayout } from "../../components/Layout";
import { withDataPayloadHint } from "../../components/DataPayloadHint";
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
  title: string;
  description: string;
  icon?: string;
  mode: "flat" | "card";
  showIcon?: boolean;
  iconPosition?: "left" | "top";
  content?: string;
  showContent?: boolean;
  footer?: string;
  showFooter?: boolean;
  actionText?: string;
  actionHref?: string;
  showAction?: boolean;
  href?: string;
  variant?: "default" | "bordered" | "elevated";
}>;

const CardInner: ComponentConfig<CardProps> = {
  fields: {
    title: {
      type: "text",
      contentEditable: true,
      label: "Title",
    },
    description: {
      type: "textarea",
      contentEditable: true,
      label: "Description",
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
      type: "textarea",
      label: "Content",
      contentEditable: true,
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
      type: "textarea",
      label: "Footer Text",
      contentEditable: true,
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
    title: "Title",
    description: "Description",
    icon: "Feather",
    mode: "flat",
    showIcon: true,
    iconPosition: "left",
    showContent: false,
    content: "",
    showFooter: false,
    footer: "",
    showAction: false,
    actionText: "Learn More",
    actionHref: "#",
    href: "",
    variant: "default",
  },
  render: ({ 
    title, 
    icon, 
    description, 
    mode, 
    showIcon = true,
    iconPosition = "left",
    content,
    showContent = false,
    footer,
    showFooter = false,
    actionText,
    actionHref,
    showAction = false,
    href,
    variant = "default",
  }) => {
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

    if (mode === "flat") {
      return (
        <CardWrapper>
          <div className="h-full flex flex-col items-center gap-4 text-center">
            {iconElement}
            <div className="text-[22px]">{title}</div>
            <div className="text-base leading-normal text-gray-600 font-light">
              {description}
            </div>
            {showContent && content && (
              <div className="text-sm text-gray-500 mt-2">{content}</div>
            )}
            {showFooter && footer && (
              <div className="text-xs text-gray-400 mt-auto pt-4">{footer}</div>
            )}
          </div>
        </CardWrapper>
      );
    }

    return (
      <CardWrapper>
        <ShadcnCard className={`h-full ${variantClasses[variant]}`}>
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
                  <CardTitle className="text-xl mb-2">{title}</CardTitle>
                  <CardDescription className="text-base">
                    {description}
                  </CardDescription>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-4">
                {iconElement}
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">{title}</CardTitle>
                  <CardDescription className="text-base">
                    {description}
                  </CardDescription>
                </div>
              </div>
            )}
          </CardHeader>
          {showContent && content && (
            <CardContent>
              <p className="text-sm text-gray-700">{content}</p>
            </CardContent>
          )}
          {showFooter && footer && (
            <CardFooter>
              <p className="text-xs text-gray-500">{footer}</p>
            </CardFooter>
          )}
        </ShadcnCard>
      </CardWrapper>
    );
  },
};

// Apply withLayout first to add layout capabilities,
// then withDataPayloadHint outside to:
// 1. Iterate the whole component including layout div (preserves DOM structure)
// 2. Resolve {{binding}} syntax within the correct scope for each iteration
export const Card = withDataPayloadHint(withLayout(CardInner));
