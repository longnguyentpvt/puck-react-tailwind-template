/* eslint-disable @next/next/no-img-element */
import React, { ReactElement, useMemo } from "react";
import { ComponentConfig } from "@measured/puck";
import dynamic from "next/dynamic";
import dynamicIconImports from "lucide-react/dynamicIconImports";
import { withLayout, WithLayout } from "../../components/Layout";
import { useDataContext } from "@/config/contexts/DataContext";
import { processTemplate } from "@/config/utils/template-processor";
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
    // Get data from context if available
    const dataContext = useDataContext();
    
    // Process template syntax for all text fields
    const dataJson = dataContext?.data ? JSON.stringify(dataContext.data) : null;
    
    const processedTitle = useMemo(() => {
      return dataContext?.data ? processTemplate(title, dataContext.data) : title;
    }, [title, dataJson]);
    
    const processedDescription = useMemo(() => {
      return dataContext?.data ? processTemplate(description, dataContext.data) : description;
    }, [description, dataJson]);
    
    const processedContent = useMemo(() => {
      return dataContext?.data ? processTemplate(content, dataContext.data) : content;
    }, [content, dataJson]);
    
    const processedFooter = useMemo(() => {
      return dataContext?.data ? processTemplate(footer, dataContext.data) : footer;
    }, [footer, dataJson]);

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
            <div className="text-[22px]">{processedTitle}</div>
            <div className="text-base leading-normal text-gray-600 font-light">
              {processedDescription}
            </div>
            {showContent && processedContent && (
              <div className="text-sm text-gray-500 mt-2">{processedContent}</div>
            )}
            {showFooter && processedFooter && (
              <div className="text-xs text-gray-400 mt-auto pt-4">{processedFooter}</div>
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
                  <CardTitle className="text-xl mb-2">{processedTitle}</CardTitle>
                  <CardDescription className="text-base">
                    {processedDescription}
                  </CardDescription>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-4">
                {iconElement}
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">{processedTitle}</CardTitle>
                  <CardDescription className="text-base">
                    {processedDescription}
                  </CardDescription>
                </div>
              </div>
            )}
          </CardHeader>
          {showContent && processedContent && (
            <CardContent>
              <p className="text-sm text-gray-700">{processedContent}</p>
            </CardContent>
          )}
          {showFooter && processedFooter && (
            <CardFooter>
              <p className="text-xs text-gray-500">{processedFooter}</p>
            </CardFooter>
          )}
        </ShadcnCard>
      </CardWrapper>
    );
  },
};

export const Card = withLayout(CardInner);
