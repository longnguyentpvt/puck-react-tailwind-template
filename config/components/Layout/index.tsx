import { CSSProperties, forwardRef, ReactNode } from "react";
import {
  ComponentConfig,
  DefaultComponentProps,
  ObjectField,
} from "@measured/puck";
import { spacingOptions } from "../../options";

type LayoutFieldProps = {
  paddingTop?: string;
  paddingBottom?: string;
  marginTop?: string;
  marginBottom?: string;
  marginLeft?: string;
  marginRight?: string;
  spanCol?: number;
  spanRow?: number;
  grow?: boolean;
  shrink?: boolean;
  basis?: "auto" | "0" | "full" | "1/2" | "1/3" | "2/3" | "1/4" | "3/4";
  alignSelf?: "auto" | "start" | "center" | "end" | "stretch";
};

export type WithLayout<Props extends DefaultComponentProps> = Props & {
  layout?: LayoutFieldProps;
};

type LayoutProps = WithLayout<{
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}>;

export const layoutField: ObjectField<LayoutFieldProps> = {
  type: "object",
  objectFields: {
    spanCol: {
      label: "Grid Columns",
      type: "number",
      min: 1,
      max: 12,
    },
    spanRow: {
      label: "Grid Rows",
      type: "number",
      min: 1,
      max: 12,
    },
    grow: {
      label: "Flex Grow",
      type: "radio",
      options: [
        { label: "true", value: true },
        { label: "false", value: false },
      ],
    },
    shrink: {
      label: "Flex Shrink",
      type: "radio",
      options: [
        { label: "true", value: true },
        { label: "false", value: false },
      ],
    },
    basis: {
      label: "Flex Basis",
      type: "select",
      options: [
        { label: "Auto", value: "auto" },
        { label: "0", value: "0" },
        { label: "Full", value: "full" },
        { label: "1/2", value: "1/2" },
        { label: "1/3", value: "1/3" },
        { label: "2/3", value: "2/3" },
        { label: "1/4", value: "1/4" },
        { label: "3/4", value: "3/4" },
      ],
    },
    alignSelf: {
      label: "Align Self",
      type: "select",
      options: [
        { label: "Auto", value: "auto" },
        { label: "Start", value: "start" },
        { label: "Center", value: "center" },
        { label: "End", value: "end" },
        { label: "Stretch", value: "stretch" },
      ],
    },
    paddingTop: {
      type: "select",
      label: "Padding Top",
      options: [
        { label: "0", value: "0" },
        { label: "2 (8px)", value: "2" },
        { label: "4 (16px)", value: "4" },
        { label: "6 (24px)", value: "6" },
        { label: "8 (32px)", value: "8" },
        { label: "10 (40px)", value: "10" },
        { label: "12 (48px)", value: "12" },
        { label: "14 (56px)", value: "14" },
        { label: "16 (64px)", value: "16" },
        { label: "20 (80px)", value: "20" },
        { label: "24 (96px)", value: "24" },
        { label: "32 (128px)", value: "32" },
      ],
    },
    paddingBottom: {
      type: "select",
      label: "Padding Bottom",
      options: [
        { label: "0", value: "0" },
        { label: "2 (8px)", value: "2" },
        { label: "4 (16px)", value: "4" },
        { label: "6 (24px)", value: "6" },
        { label: "8 (32px)", value: "8" },
        { label: "10 (40px)", value: "10" },
        { label: "12 (48px)", value: "12" },
        { label: "14 (56px)", value: "14" },
        { label: "16 (64px)", value: "16" },
        { label: "20 (80px)", value: "20" },
        { label: "24 (96px)", value: "24" },
        { label: "32 (128px)", value: "32" },
      ],
    },
    marginTop: {
      type: "select",
      label: "Margin Top",
      options: [
        { label: "0", value: "0" },
        { label: "2 (8px)", value: "2" },
        { label: "4 (16px)", value: "4" },
        { label: "6 (24px)", value: "6" },
        { label: "8 (32px)", value: "8" },
        { label: "10 (40px)", value: "10" },
        { label: "12 (48px)", value: "12" },
        { label: "14 (56px)", value: "14" },
        { label: "16 (64px)", value: "16" },
        { label: "20 (80px)", value: "20" },
        { label: "24 (96px)", value: "24" },
        { label: "32 (128px)", value: "32" },
      ],
    },
    marginBottom: {
      type: "select",
      label: "Margin Bottom",
      options: [
        { label: "0", value: "0" },
        { label: "2 (8px)", value: "2" },
        { label: "4 (16px)", value: "4" },
        { label: "6 (24px)", value: "6" },
        { label: "8 (32px)", value: "8" },
        { label: "10 (40px)", value: "10" },
        { label: "12 (48px)", value: "12" },
        { label: "14 (56px)", value: "14" },
        { label: "16 (64px)", value: "16" },
        { label: "20 (80px)", value: "20" },
        { label: "24 (96px)", value: "24" },
        { label: "32 (128px)", value: "32" },
      ],
    },
    marginLeft: {
      type: "select",
      label: "Margin Left",
      options: [
        { label: "0", value: "0" },
        { label: "2 (8px)", value: "2" },
        { label: "4 (16px)", value: "4" },
        { label: "6 (24px)", value: "6" },
        { label: "8 (32px)", value: "8" },
        { label: "10 (40px)", value: "10" },
        { label: "12 (48px)", value: "12" },
        { label: "14 (56px)", value: "14" },
        { label: "16 (64px)", value: "16" },
        { label: "20 (80px)", value: "20" },
        { label: "24 (96px)", value: "24" },
        { label: "32 (128px)", value: "32" },
      ],
    },
    marginRight: {
      type: "select",
      label: "Margin Right",
      options: [
        { label: "0", value: "0" },
        { label: "2 (8px)", value: "2" },
        { label: "4 (16px)", value: "4" },
        { label: "6 (24px)", value: "6" },
        { label: "8 (32px)", value: "8" },
        { label: "10 (40px)", value: "10" },
        { label: "12 (48px)", value: "12" },
        { label: "14 (56px)", value: "14" },
        { label: "16 (64px)", value: "16" },
        { label: "20 (80px)", value: "20" },
        { label: "24 (96px)", value: "24" },
        { label: "32 (128px)", value: "32" },
      ],
    },
  },
};

const Layout = forwardRef<HTMLDivElement, LayoutProps>(
  ({ children, className, layout, style }, ref) => {
    const basisClass = layout?.basis
      ? {
          auto: "basis-auto",
          "0": "basis-0",
          full: "basis-full",
          "1/2": "basis-1/2",
          "1/3": "basis-1/3",
          "2/3": "basis-2/3",
          "1/4": "basis-1/4",
          "3/4": "basis-3/4",
        }[layout.basis]
      : undefined;

    const alignSelfClass = layout?.alignSelf
      ? {
          auto: "self-auto",
          start: "self-start",
          center: "self-center",
          end: "self-end",
          stretch: "self-stretch",
        }[layout.alignSelf]
      : undefined;

    const paddingTopClass = layout?.paddingTop
      ? {
          "0": "pt-0",
          "2": "pt-2",
          "4": "pt-4",
          "6": "pt-6",
          "8": "pt-8",
          "10": "pt-10",
          "12": "pt-12",
          "14": "pt-14",
          "16": "pt-16",
          "20": "pt-20",
          "24": "pt-24",
          "32": "pt-32",
        }[layout.paddingTop]
      : "";

    const paddingBottomClass = layout?.paddingBottom
      ? {
          "0": "pb-0",
          "2": "pb-2",
          "4": "pb-4",
          "6": "pb-6",
          "8": "pb-8",
          "10": "pb-10",
          "12": "pb-12",
          "14": "pb-14",
          "16": "pb-16",
          "20": "pb-20",
          "24": "pb-24",
          "32": "pb-32",
        }[layout.paddingBottom]
      : "";

    const marginTopClass = layout?.marginTop
      ? {
          "0": "mt-0",
          "2": "mt-2",
          "4": "mt-4",
          "6": "mt-6",
          "8": "mt-8",
          "10": "mt-10",
          "12": "mt-12",
          "14": "mt-14",
          "16": "mt-16",
          "20": "mt-20",
          "24": "mt-24",
          "32": "mt-32",
        }[layout.marginTop]
      : "";

    const marginBottomClass = layout?.marginBottom
      ? {
          "0": "mb-0",
          "2": "mb-2",
          "4": "mb-4",
          "6": "mb-6",
          "8": "mb-8",
          "10": "mb-10",
          "12": "mb-12",
          "14": "mb-14",
          "16": "mb-16",
          "20": "mb-20",
          "24": "mb-24",
          "32": "mb-32",
        }[layout.marginBottom]
      : "";

    const marginLeftClass = layout?.marginLeft
      ? {
          "0": "ml-0",
          "2": "ml-2",
          "4": "ml-4",
          "6": "ml-6",
          "8": "ml-8",
          "10": "ml-10",
          "12": "ml-12",
          "14": "ml-14",
          "16": "ml-16",
          "20": "ml-20",
          "24": "ml-24",
          "32": "ml-32",
        }[layout.marginLeft]
      : "";

    const marginRightClass = layout?.marginRight
      ? {
          "0": "mr-0",
          "2": "mr-2",
          "4": "mr-4",
          "6": "mr-6",
          "8": "mr-8",
          "10": "mr-10",
          "12": "mr-12",
          "14": "mr-14",
          "16": "mr-16",
          "20": "mr-20",
          "24": "mr-24",
          "32": "mr-32",
        }[layout.marginRight]
      : "";

    return (
      <div
        className={`${className || ""} ${basisClass || ""} ${alignSelfClass || ""} ${paddingTopClass} ${paddingBottomClass} ${marginTopClass} ${marginBottomClass} ${marginLeftClass} ${marginRightClass}`.trim()}
        style={{
          gridColumn: layout?.spanCol
            ? `span ${Math.max(Math.min(layout.spanCol, 12), 1)}`
            : undefined,
          gridRow: layout?.spanRow
            ? `span ${Math.max(Math.min(layout.spanRow, 12), 1)}`
            : undefined,
          flexGrow: layout?.grow ? 1 : undefined,
          flexShrink: layout?.shrink ? 1 : layout?.shrink === false ? 0 : undefined,
          ...style,
        }}
        ref={ref}
      >
        {children}
      </div>
    );
  }
);

Layout.displayName = "Layout";

export { Layout };

export function withLayout<
  ThisComponentConfig extends ComponentConfig<any> = ComponentConfig
>(componentConfig: ThisComponentConfig): ThisComponentConfig {
  return {
    ...componentConfig,
    fields: {
      ...componentConfig.fields,
      layout: layoutField,
    },
    defaultProps: {
      ...componentConfig.defaultProps,
      layout: {
        spanCol: 1,
        spanRow: 1,
        paddingTop: "0",
        paddingBottom: "0",
        marginTop: "0",
        marginBottom: "0",
        marginLeft: "0",
        marginRight: "0",
        grow: false,
        shrink: true,
        basis: "auto",
        alignSelf: "auto",
        ...componentConfig.defaultProps?.layout,
      },
    },
    resolveFields: (_, params) => {
      if (params.parent?.type === "Grid") {
        return {
          ...componentConfig.fields,
          layout: {
            ...layoutField,
            objectFields: {
              spanCol: layoutField.objectFields.spanCol,
              spanRow: layoutField.objectFields.spanRow,
              paddingTop: layoutField.objectFields.paddingTop,
              paddingBottom: layoutField.objectFields.paddingBottom,
              marginTop: layoutField.objectFields.marginTop,
              marginBottom: layoutField.objectFields.marginBottom,
              marginLeft: layoutField.objectFields.marginLeft,
              marginRight: layoutField.objectFields.marginRight,
            },
          },
        };
      }
      if (params.parent?.type === "Flex") {
        return {
          ...componentConfig.fields,
          layout: {
            ...layoutField,
            objectFields: {
              grow: layoutField.objectFields.grow,
              shrink: layoutField.objectFields.shrink,
              basis: layoutField.objectFields.basis,
              alignSelf: layoutField.objectFields.alignSelf,
              paddingTop: layoutField.objectFields.paddingTop,
              paddingBottom: layoutField.objectFields.paddingBottom,
              marginTop: layoutField.objectFields.marginTop,
              marginBottom: layoutField.objectFields.marginBottom,
              marginLeft: layoutField.objectFields.marginLeft,
              marginRight: layoutField.objectFields.marginRight,
            },
          },
        };
      }

      return {
        ...componentConfig.fields,
        layout: {
          ...layoutField,
          objectFields: {
            paddingTop: layoutField.objectFields.paddingTop,
            paddingBottom: layoutField.objectFields.paddingBottom,
            marginTop: layoutField.objectFields.marginTop,
            marginBottom: layoutField.objectFields.marginBottom,
            marginLeft: layoutField.objectFields.marginLeft,
            marginRight: layoutField.objectFields.marginRight,
          },
        },
      };
    },
    inline: true,
    render: (props) => (
      <Layout
        className="block"
        layout={props.layout as LayoutFieldProps}
        ref={props.puck.dragRef}
      >
        {componentConfig.render(props)}
      </Layout>
    ),
  };
}
