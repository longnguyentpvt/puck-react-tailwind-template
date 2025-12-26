import { Accordion } from "./blocks/Accordion";
import { Badge } from "./blocks/Badge";
import { Banner } from "./blocks/Banner";
import { Button } from "./blocks/Button";
import { Card } from "./blocks/Card";
import { Carousel } from "./blocks/Carousel";
import { Grid } from "./blocks/Grid";
import { Heading } from "./blocks/Heading";
import { Flex } from "./blocks/Flex";
import { Logos } from "./blocks/Logos";
import { Stats } from "./blocks/Stats";
import { Template } from "./blocks/Template";
import { Text } from "./blocks/Text";
import { Toggle } from "./blocks/Toggle";
import { ToggleGroup } from "./blocks/ToggleGroup";
import { Space } from "./blocks/Space";
import { RichText } from "./blocks/RichText";

import Root from "./root";
import { UserConfig } from "./types";
import { initialData } from "./initial-data";

// We avoid the name config as next gets confused
export const conf: UserConfig = {
  root: Root,
  categories: {
    layout: {
      components: ["Grid", "Flex", "Space"],
    },
    typography: {
      components: ["Heading", "Text", "RichText"],
    },
    content: {
      title: "Content",
      components: ["Banner", "Carousel", "Accordion"],
    },
    interactive: {
      title: "Actions",
      components: ["Button", "Toggle", "ToggleGroup"],
    },
    other: {
      title: "Other",
      components: ["Badge", "Card", "Logos", "Stats", "Template", "HeadingBlock"],
    },
  },
  components: {
    Accordion,
    Badge,
    Banner,
    Button,
    Card,
    Carousel,
    Grid,
    Heading,
    Flex,
    Logos,
    Stats,
    Template,
    Text,
    Toggle,
    ToggleGroup,
    Space,
    RichText,
    HeadingBlock: {
      fields: {
        title: { type: "text" },
      },
      defaultProps: {
        title: "Heading",
      },
      render: ({ title }) => (
        <div style={{ padding: 64 }}>
          <h1>{title}</h1>
        </div>
      ),
    },
  },
};

export const componentKey = Buffer.from(
  `${Object.keys(conf.components).join("-")}-${JSON.stringify(initialData)}`
).toString("base64");

export default conf;
