import { Accordion } from "./blocks/Accordion";
import { Animate } from "./blocks/Animate";
import { Banner } from "./blocks/Banner";
import { Button } from "./blocks/Button";
import { Card } from "./blocks/Card";
import { Carousel } from "./blocks/Carousel";
import { Dialog } from "./blocks/Dialog";
import { Grid } from "./blocks/Grid";
import { Heading } from "./blocks/Heading";
import { Flex } from "./blocks/Flex";
import { Logos } from "./blocks/Logos";
import { PetList } from "./blocks/PetList";
import { DataRepeater } from "./blocks/DataRepeater";
import { DataBoundText } from "./blocks/DataBoundText";
import { Stats } from "./blocks/Stats";
import { Template } from "./blocks/Template/server";
import { Text } from "./blocks/Text";
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
      components: ["Banner", "Carousel", "Accordion", "Dialog", "PetList"],
    },
    data: {
      title: "Data",
      components: ["DataRepeater", "DataBoundText"],
    },
    interactive: {
      title: "Actions",
      components: ["Button", "Animate"],
    },
    other: {
      title: "Other",
      components: ["Card", "Logos", "Stats", "Template"],
    },
  },
  components: {
    Accordion,
    Animate,
    Banner,
    Button,
    Card,
    Carousel,
    Dialog,
    DataRepeater,
    DataBoundText,
    Grid,
    Heading,
    Flex,
    Logos,
    PetList,
    Stats,
    Template,
    Text,
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
