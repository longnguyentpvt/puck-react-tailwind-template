import React from "react";
import classNames from "classnames";
import { ComponentConfig } from "@measured/puck";
import { spacingOptions } from "../../options";

export type SpaceProps = {
  direction?: "" | "vertical" | "horizontal";
  size: string;
};

export const Space: ComponentConfig<SpaceProps> = {
  label: "Space",
  fields: {
    size: {
      type: "select",
      options: spacingOptions,
    },
    direction: {
      type: "radio",
      options: [
        { value: "vertical", label: "Vertical" },
        { value: "horizontal", label: "Horizontal" },
        { value: "", label: "Both" },
      ],
    },
  },
  defaultProps: {
    direction: "",
    size: "6",
  },
  inline: true,
  render: ({ direction, size, puck }) => {
    // Convert Tailwind spacing scale to pixels (1 unit = 4px)
    const sizeInPx = `${Number(size) * 4}px`;
    
    return (
      <div
        ref={puck.dragRef}
        className={classNames(
          "block",
          direction === "vertical" && "w-full",
          direction === "horizontal" && "h-full"
        )}
        style={{
          height: direction === "horizontal" ? "100%" : sizeInPx,
          width: direction === "vertical" ? "100%" : sizeInPx,
        }}
      />
    );
  },
};
