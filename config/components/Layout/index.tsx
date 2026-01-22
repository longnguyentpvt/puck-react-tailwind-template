import { CSSProperties, forwardRef, ReactNode } from "react";
import {
  ComponentConfig,
  DefaultComponentProps,
  ObjectField,
  Field,
} from "@measured/puck";
import { spacingOptions } from "../../options";
import { TabbedLayoutField } from "../../fields/TabbedLayoutField";

type ResponsiveValue<T> = {
  base?: T;
  md?: T;
  lg?: T;
};

type LayoutFieldProps = {
  paddingTop?: ResponsiveValue<string> | string;
  paddingBottom?: ResponsiveValue<string> | string;
  marginTop?: ResponsiveValue<string> | string;
  marginBottom?: ResponsiveValue<string> | string;
  marginLeft?: ResponsiveValue<string> | string;
  marginRight?: ResponsiveValue<string> | string;
  spanCol?: ResponsiveValue<number> | number;
  spanRow?: ResponsiveValue<number> | number;
  flex?: ResponsiveValue<"1" | "auto" | "initial" | "none" | "1/2" | "1/3" | "2/3" | "1/4" | "3/4" | "full"> | "1" | "auto" | "initial" | "none" | "1/2" | "1/3" | "2/3" | "1/4" | "3/4" | "full";
  alignSelf?: ResponsiveValue<"auto" | "start" | "center" | "end" | "stretch"> | "auto" | "start" | "center" | "end" | "stretch";
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
    flex: {
      label: "Flex",
      type: "select",
      options: [
        { label: "flex-1 (grow/shrink equally)", value: "1" },
        { label: "flex-auto (grow/shrink with basis auto)", value: "auto" },
        { label: "flex-initial (no grow, can shrink)", value: "initial" },
        { label: "flex-none (no grow/shrink)", value: "none" },
        { label: "basis-full (100% width)", value: "full" },
        { label: "basis-1/2 (50% width)", value: "1/2" },
        { label: "basis-1/3 (33% width)", value: "1/3" },
        { label: "basis-2/3 (66% width)", value: "2/3" },
        { label: "basis-1/4 (25% width)", value: "1/4" },
        { label: "basis-3/4 (75% width)", value: "3/4" },
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
      options: spacingOptions,
    },
    paddingBottom: {
      type: "select",
      label: "Padding Bottom",
      options: spacingOptions,
    },
    marginTop: {
      type: "select",
      label: "Margin Top",
      options: spacingOptions,
    },
    marginBottom: {
      type: "select",
      label: "Margin Bottom",
      options: spacingOptions,
    },
    marginLeft: {
      type: "select",
      label: "Margin Left",
      options: spacingOptions,
    },
    marginRight: {
      type: "select",
      label: "Margin Right",
      options: spacingOptions,
    },
  },
};

export const layoutFieldDefinition: ObjectField<LayoutFieldProps> = {
  type: "object",
  label: "Layout",
  objectFields: {
    paddingTop: layoutField.objectFields.paddingTop,
    paddingBottom: layoutField.objectFields.paddingBottom,
    marginTop: layoutField.objectFields.marginTop,
    marginBottom: layoutField.objectFields.marginBottom,
    marginLeft: layoutField.objectFields.marginLeft,
    marginRight: layoutField.objectFields.marginRight,
  },
};

// Safelist: Declare all possible responsive classes so Tailwind compiles them
// prettier-ignore
const TAILWIND_CLASSES = [
  // Flex base classes
  'flex-1', 'flex-auto', 'flex-initial', 'flex-none',
  'basis-full', 'basis-1/2', 'basis-1/3', 'basis-2/3', 'basis-1/4', 'basis-3/4',
  // Flex responsive classes
  'md:flex-1', 'md:flex-auto', 'md:flex-initial', 'md:flex-none',
  'md:basis-full', 'md:basis-1/2', 'md:basis-1/3', 'md:basis-2/3', 'md:basis-1/4', 'md:basis-3/4',
  'lg:flex-1', 'lg:flex-auto', 'lg:flex-initial', 'lg:flex-none',
  'lg:basis-full', 'lg:basis-1/2', 'lg:basis-1/3', 'lg:basis-2/3', 'lg:basis-1/4', 'lg:basis-3/4',
  // Align self base classes
  'self-auto', 'self-start', 'self-center', 'self-end', 'self-stretch',
  // Align self responsive classes
  'md:self-auto', 'md:self-start', 'md:self-center', 'md:self-end', 'md:self-stretch',
  'lg:self-auto', 'lg:self-start', 'lg:self-center', 'lg:self-end', 'lg:self-stretch',
];

const Layout = forwardRef<HTMLDivElement, LayoutProps>(
  ({ children, className, layout, style }, ref) => {
    // Helper to get responsive classes
    const getResponsiveClasses = (
      value: ResponsiveValue<any> | string | number | undefined,
      classMap: Record<string, string>
    ): string => {
      if (!value) return "";
      
      // Handle legacy simple values
      if (typeof value === 'string' || typeof value === 'number') {
        return classMap[value] || "";
      }
      
      // Handle responsive values
      const classes: string[] = [];
      if (value.base) classes.push(classMap[value.base] || "");
      if (value.md) classes.push(`md:${classMap[value.md] || ""}`);
      if (value.lg) classes.push(`lg:${classMap[value.lg] || ""}`);
      
      return classes.filter(Boolean).join(" ");
    };

    const flexClasses = getResponsiveClasses(layout?.flex, {
      "1": "flex-1",
      auto: "flex-auto",
      initial: "flex-initial",
      none: "flex-none",
      full: "basis-full",
      "1/2": "basis-1/2",
      "1/3": "basis-1/3",
      "2/3": "basis-2/3",
      "1/4": "basis-1/4",
      "3/4": "basis-3/4",
    });

    const alignSelfClasses = getResponsiveClasses(layout?.alignSelf, {
      auto: "self-auto",
      start: "self-start",
      center: "self-center",
      end: "self-end",
      stretch: "self-stretch",
    });

    const paddingTopClasses = getResponsiveClasses(layout?.paddingTop, {
      "0": "pt-0", "2": "pt-2", "4": "pt-4", "6": "pt-6", "8": "pt-8",
      "10": "pt-10", "12": "pt-12", "14": "pt-14", "16": "pt-16",
      "20": "pt-20", "24": "pt-24", "32": "pt-32",
    });

    const paddingBottomClasses = getResponsiveClasses(layout?.paddingBottom, {
      "0": "pb-0", "2": "pb-2", "4": "pb-4", "6": "pb-6", "8": "pb-8",
      "10": "pb-10", "12": "pb-12", "14": "pb-14", "16": "pb-16",
      "20": "pb-20", "24": "pb-24", "32": "pb-32",
    });

    const marginTopClasses = getResponsiveClasses(layout?.marginTop, {
      "0": "mt-0", "2": "mt-2", "4": "mt-4", "6": "mt-6", "8": "mt-8",
      "10": "mt-10", "12": "mt-12", "14": "mt-14", "16": "mt-16",
      "20": "mt-20", "24": "mt-24", "32": "mt-32",
    });

    const marginBottomClasses = getResponsiveClasses(layout?.marginBottom, {
      "0": "mb-0", "2": "mb-2", "4": "mb-4", "6": "mb-6", "8": "mb-8",
      "10": "mb-10", "12": "mb-12", "14": "mb-14", "16": "mb-16",
      "20": "mb-20", "24": "mb-24", "32": "mb-32",
    });

    const marginLeftClasses = getResponsiveClasses(layout?.marginLeft, {
      "0": "ml-0", "2": "ml-2", "4": "ml-4", "6": "ml-6", "8": "ml-8",
      "10": "ml-10", "12": "ml-12", "14": "ml-14", "16": "ml-16",
      "20": "ml-20", "24": "ml-24", "32": "ml-32",
    });

    const marginRightClasses = getResponsiveClasses(layout?.marginRight, {
      "0": "mr-0", "2": "mr-2", "4": "mr-4", "6": "mr-6", "8": "mr-8",
      "10": "mr-10", "12": "mr-12", "14": "mr-14", "16": "mr-16",
      "20": "mr-20", "24": "mr-24", "32": "mr-32",
    });

    // Helper to get responsive style values
    const getResponsiveValue = (value: ResponsiveValue<number> | number | undefined): number | undefined => {
      if (!value) return undefined;
      if (typeof value === 'number') return value;
      return value.base; // Only use base value for inline styles
    };
    
    const finalClassName = `${className || ""} ${flexClasses} ${alignSelfClasses} ${paddingTopClasses} ${paddingBottomClasses} ${marginTopClasses} ${marginBottomClasses} ${marginLeftClasses} ${marginRightClasses}`.trim();

    return (
      <div
        className={finalClassName}
        style={{
          gridColumn: getResponsiveValue(layout?.spanCol)
            ? `span ${Math.max(Math.min(getResponsiveValue(layout?.spanCol)!, 12), 1)}`
            : undefined,
          gridRow: getResponsiveValue(layout?.spanRow)
            ? `span ${Math.max(Math.min(getResponsiveValue(layout?.spanRow)!, 12), 1)}`
            : undefined,
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
      layout: layoutFieldDefinition,
    },
    defaultProps: {
      ...componentConfig.defaultProps,
      layout: {
        spanCol: { base: 1 },
        spanRow: { base: 1 },
        paddingTop: { base: "0" },
        paddingBottom: { base: "0" },
        marginTop: { base: "0" },
        marginBottom: { base: "0" },
        marginLeft: { base: "0" },
        marginRight: { base: "0" },
        flex: { base: "initial" },
        alignSelf: { base: "auto" },
        ...componentConfig.defaultProps?.layout,
      },
    },
    resolveFields: (data, params) => {
      const parentType = params.parent?.type;
      
      let layoutFields = {};
      
      if (parentType === "Grid") {
        layoutFields = {
          spanCol: layoutField.objectFields.spanCol,
          spanRow: layoutField.objectFields.spanRow,
          paddingTop: layoutField.objectFields.paddingTop,
          paddingBottom: layoutField.objectFields.paddingBottom,
          marginTop: layoutField.objectFields.marginTop,
          marginBottom: layoutField.objectFields.marginBottom,
          marginLeft: layoutField.objectFields.marginLeft,
          marginRight: layoutField.objectFields.marginRight,
        };
      } else if (parentType === "Flex") {
        layoutFields = {
          flex: layoutField.objectFields.flex,
          alignSelf: layoutField.objectFields.alignSelf,
          paddingTop: layoutField.objectFields.paddingTop,
          paddingBottom: layoutField.objectFields.paddingBottom,
          marginTop: layoutField.objectFields.marginTop,
          marginBottom: layoutField.objectFields.marginBottom,
          marginLeft: layoutField.objectFields.marginLeft,
          marginRight: layoutField.objectFields.marginRight,
        };
      } else {
        layoutFields = {
          paddingTop: layoutField.objectFields.paddingTop,
          paddingBottom: layoutField.objectFields.paddingBottom,
          marginTop: layoutField.objectFields.marginTop,
          marginBottom: layoutField.objectFields.marginBottom,
          marginLeft: layoutField.objectFields.marginLeft,
          marginRight: layoutField.objectFields.marginRight,
        };
      }
      
      // Call the component's resolveFields if it exists
      const baseFields = componentConfig.resolveFields 
        ? componentConfig.resolveFields(data, params)
        : componentConfig.fields;
      
      return {
        ...baseFields,
        layout: {
          type: "custom",
          label: "Layout",
          render: ({ value, onChange, name }) => {
            return (
              <TabbedLayoutField 
                field={{
                  type: "custom",
                  label: "Layout",
                  objectFields: layoutFields,
                }}
                value={value}
                onChange={onChange}
                name={name}
              />
            );
          },
        } as any,
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
