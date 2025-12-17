/* eslint-disable @next/next/no-img-element */
import React, { ReactElement } from "react";
import classNames from "classnames";
import { ComponentConfig } from "@measured/puck";
import dynamic from "next/dynamic";
import dynamicIconImports from "lucide-react/dynamicIconImports";
import { withLayout, WithLayout } from "../../components/Layout";

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
}>;

const CardInner: ComponentConfig<CardProps> = {
  fields: {
    title: {
      type: "text",
      contentEditable: true,
    },
    description: {
      type: "textarea",
      contentEditable: true,
    },
    icon: {
      type: "select",
      options: iconOptions,
    },
    mode: {
      type: "radio",
      options: [
        { label: "card", value: "card" },
        { label: "flat", value: "flat" },
      ],
    },
  },
  defaultProps: {
    title: "Title",
    description: "Description",
    icon: "Feather",
    mode: "flat",
  },
  render: ({ title, icon, description, mode }) => {
    return (
      <div 
        className={classNames(
          "h-full",
          mode === "card" && "bg-white shadow-[rgba(140,152,164,0.25)_0px_3px_6px_0px] rounded-lg max-w-full"
        )}
      >
        <div 
          className={classNames(
            "flex items-center gap-4 flex-col",
            mode === "card" && "items-start p-6"
          )}
        >
          <div className="rounded-full bg-blue-100 text-blue-600 flex justify-center items-center w-16 h-16">
            {icon && icons[icon]}
          </div>

          <div 
            className={classNames(
              "text-[22px] text-center",
              mode === "card" && "text-left"
            )}
          >
            {title}
          </div>
          <div 
            className={classNames(
              "text-base leading-normal text-gray-600 text-center font-light",
              mode === "card" && "text-left"
            )}
          >
            {description}
          </div>
        </div>
      </div>
    );
  },
};

export const Card = withLayout(CardInner);
