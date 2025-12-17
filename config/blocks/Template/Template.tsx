import React from "react";
import { Slot } from "@/core/types";
import { Section } from "../../components/Section";
import { PuckComponent } from "@/core/types";

export type TemplateProps = {
  template: string;
  children: Slot;
};

export const Template: PuckComponent<TemplateProps> = ({
  children: Children,
}) => {
  return (
    <Section>
      <Children className="flex flex-col w-auto md:grid" />
    </Section>
  );
};

export default Template;
