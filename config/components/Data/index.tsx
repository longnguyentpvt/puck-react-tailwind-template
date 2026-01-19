"use client";

import React, { ReactNode } from "react";
import {
  ComponentConfig,
  DefaultComponentProps,
  ObjectField,
} from "@measured/puck";
import { DataScopeProvider, DataScope, getValueByPath } from "@/lib/data-binding";
import { BINDABLE_COLLECTIONS } from "@/lib/data-binding/bindable-collections";
import { getMockData } from "@/lib/data-binding/payload-data-source";

/**
 * Data binding field props that can be added to any component
 */
export type DataFieldProps = {
  /**
   * Slug of the Payload collection to use as data source (e.g., "products")
   */
  source?: string;
  /**
   * Variable name to expose the data as in the scope
   * Children can access it using {{variableName.fieldPath}}
   */
  as?: string;
};

export type WithData<Props extends DefaultComponentProps> = Props & {
  data?: DataFieldProps;
};

/**
 * Data binding field definition
 */
export const dataField: ObjectField<DataFieldProps> = {
  type: "object",
  label: "Data Binding",
  objectFields: {
    source: {
      type: "select",
      label: "Data Source Collection",
      options: [
        { label: "Select a collection...", value: "" },
        ...BINDABLE_COLLECTIONS.map(c => ({
          label: c.label,
          value: c.slug,
        })),
      ],
    },
    as: {
      type: "text",
      label: "Variable Name",
    },
  },
};

/**
 * Helper to detect if value is an array
 */
function isArrayData(data: unknown): data is unknown[] {
  return Array.isArray(data);
}

/**
 * Props for the DataWrapper component
 */
interface DataWrapperProps {
  data?: DataFieldProps;
  children: ReactNode;
}

/**
 * DataWrapper component that wraps children with data scope when configured.
 * Note: This component only provides data to the scope. Iteration is handled
 * by child components using the withDataPayloadHint HOC.
 */
export function DataWrapper({ data, children }: DataWrapperProps) {
  // If no data binding is configured, render children directly
  if (!data || !data.source || !data.as) {
    return <>{children}</>;
  }

  const { source, as: variableName } = data;

  // Fetch data from Payload collection (using mock data in client components)
  // In client components, we use mock data. For server components, use fetchPayloadCollectionData
  const resolvedData = getMockData(source);

  // Handle missing data
  if (resolvedData === undefined || resolvedData === null) {
    return <>{children}</>;
  }

  // Provide the data to the scope (whether it's an array or object)
  const variables: DataScope = {
    [variableName]: resolvedData,
  };

  return (
    <DataScopeProvider variables={variables}>
      {children}
    </DataScopeProvider>
  );
}

/**
 * HOC that adds data binding capabilities to a component
 */
export function withData<
  ThisComponentConfig extends ComponentConfig<any> = ComponentConfig
>(componentConfig: ThisComponentConfig): ThisComponentConfig {
  const originalRender = componentConfig.render;

  return {
    ...componentConfig,
    fields: {
      ...componentConfig.fields,
      data: dataField,
    },
    defaultProps: {
      ...componentConfig.defaultProps,
      data: {
        source: "",
        as: "",
        ...componentConfig.defaultProps?.data,
      },
    },
    render: (props) => {
      const dataProps = props.data as DataFieldProps | undefined;

      // Get the original rendered content
      const content = originalRender(props);

      // Wrap with DataWrapper
      return (
        <DataWrapper data={dataProps}>
          {content}
        </DataWrapper>
      );
    },
  };
}

/**
 * Props for SlotLoop component
 */
interface SlotLoopProps {
  /** The slot component to render (Items from Puck slot) */
  children: ReactNode;
  /** Data binding configuration */
  data?: DataFieldProps;
}

/**
 * SlotLoop component that provides data scope to slot content.
 * 
 * @deprecated This component is deprecated. Use withData HOC on layout components
 * and withDataPayloadHint on child components for better control.
 * 
 * @example Basic usage
 * ```tsx
 * <SlotLoop data={data}>
 *   <Items />
 * </SlotLoop>
 * ```
 */
export function SlotLoop({ children, data }: SlotLoopProps) {
  // If no data binding configured, render children directly
  if (!data || !data.source || !data.as) {
    return <>{children}</>;
  }

  const { source, as: variableName } = data;

  // Fetch data from Payload collection (using mock data in client components)
  const resolvedData = getMockData(source);

  // Handle missing data
  if (resolvedData === undefined || resolvedData === null) {
    return <>{children}</>;
  }

  // Just provide the data scope, let child components handle iteration
  const variables: DataScope = {
    [variableName]: resolvedData,
  };

  return (
    <DataScopeProvider variables={variables}>
      {children}
    </DataScopeProvider>
  );
}
