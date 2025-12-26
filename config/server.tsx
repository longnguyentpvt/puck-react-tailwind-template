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
import { Template } from "./blocks/Template/server";
import { Text } from "./blocks/Text";
import { Toggle } from "./blocks/Toggle";
import { ToggleGroup } from "./blocks/ToggleGroup";
import { Space } from "./blocks/Space";
import { RichText } from "./blocks/RichText";
import Root from "./root";
import { UserConfig } from "./types";

// We avoid the name config as next gets confused
const conf: UserConfig = {
  root: Root,
  categories: {
    layout: {
      components: ["Grid", "Flex", "Space"],
    },
    typography: {
      components: ["Heading", "Text"],
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
      components: ["Badge", "Card", "Logos", "Stats", "Template"],
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
      label: "Heading",
      fields: { title: { type: "text" } },
      defaultProps: { title: "Heading" },
      render: ({ title }) => <h2>{title}</h2>,
    },
  },
};

export default conf;
