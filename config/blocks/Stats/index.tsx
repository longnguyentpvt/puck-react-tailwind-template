/* eslint-disable @next/next/no-img-element */
import React from "react";
import { ComponentConfig } from "@measured/puck";
import { Section } from "../../components/Section";

export type StatsProps = {
  items: {
    title: string;
    description: string;
  }[];
};

export const Stats: ComponentConfig<StatsProps> = {
  fields: {
    items: {
      type: "array",
      getItemSummary: (item, i) =>
        item.title && item.description
          ? `${item.title} (${item.description})`
          : `Feature #${i}`,
      defaultItemProps: {
        title: "Stat",
        description: "1,000",
      },
      arrayFields: {
        title: {
          type: "text",
          contentEditable: true,
        },
        description: {
          type: "text",
          contentEditable: true,
        },
      },
    },
  },
  defaultProps: {
    items: [
      {
        title: "Stat",
        description: "1,000",
      },
    ],
  },
  render: ({ items }) => {
    return (
      <Section maxWidth={"916px"}>
        <div className="bg-linear-to-br from-blue-500 to-blue-700 rounded-3xl grid grid-cols-1 gap-18 items-center justify-between mx-auto max-w-3xl px-4 py-16 md:px-6 lg:grid-cols-2 lg:py-32 lg:max-w-full">
          {items.map((item, i) => (
            <div key={i} className="flex flex-col items-center text-white gap-2 w-full text-center">
              <div className="text-sm uppercase tracking-widest font-semibold">{item.title}</div>
              <div className="text-5xl font-bold">{item.description}</div>
            </div>
          ))}
        </div>
      </Section>
    );
  },
};
