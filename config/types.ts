import { Config, Data } from "@measured/puck";
import { AccordionProps } from "./blocks/Accordion";
import { AnimateProps } from "./blocks/Animate";
import { BannerProps } from "./blocks/Banner";
import { ButtonProps } from "./blocks/Button";
import { CardProps } from "./blocks/Card";
import { CarouselProps } from "./blocks/Carousel";
import { DialogProps } from "./blocks/Dialog";
import { GridProps } from "./blocks/Grid";
import { HeadingProps } from "./blocks/Heading";
import { FlexProps } from "./blocks/Flex";
import { LogosProps } from "./blocks/Logos";
import { StatsProps } from "./blocks/Stats";
import { TemplateProps } from "./blocks/Template";
import { TextProps } from "./blocks/Text";
import { SpaceProps } from "./blocks/Space";
import { PaginationProps } from "./blocks/Pagination";

import { RootProps } from "./root";
import { RichTextProps } from "./blocks/RichText";

export type { RootProps } from "./root";

export type Components = {
  Accordion: AccordionProps;
  Animate: AnimateProps;
  Banner: BannerProps;
  Button: ButtonProps;
  Card: CardProps;
  Carousel: CarouselProps;
  Dialog: DialogProps;
  Grid: GridProps;
  Heading: HeadingProps;
  Flex: FlexProps;
  Logos: LogosProps;
  Stats: StatsProps;
  Template: TemplateProps;
  Text: TextProps;
  Space: SpaceProps;
  RichText: RichTextProps;
  Pagination: PaginationProps;
  HeadingBlock: { title: string };
};

export type UserConfig = Config<{
  components: Components;
  root: RootProps;
  categories: ["layout", "typography", "content", "interactive", "navigation"];
  fields: {
    userField: {
      type: "userField";
      option: boolean;
    };
  };
}>;

export type UserData = Data<Components, RootProps>;
