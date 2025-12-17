import React from "react";
import { ComponentConfig } from "@measured/puck";

export type BlankProps = {};

export const Blank: ComponentConfig<BlankProps> = {
  fields: {},
  defaultProps: {},
  render: () => {
    return <div className="bg-[hotpink] p-4"></div>;
  },
};
