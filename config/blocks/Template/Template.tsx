import React from "react";
import type { Slot, PuckComponent } from "@measured/puck";
import { Section } from "@/config/components/Section";

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
