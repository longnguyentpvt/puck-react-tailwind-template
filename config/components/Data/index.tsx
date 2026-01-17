"use client";

import React, { ReactNode } from "react";
import {
  ComponentConfig,
  DefaultComponentProps,
  ObjectField,
} from "@measured/puck";
import { DataScopeProvider, DataScope, getValueByPath } from "@/lib/data-binding";

/**
 * Data binding field props that can be added to any component
 */
export type DataFieldProps = {
  /**
   * Path to the data source (e.g., "externalData.products" or "externalData.user")
   * Uses dot notation to access nested data
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
      type: "text",
      label: "Data Source",
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
 * Mock external data for demonstration
 * In production, this would come from externalData passed via Puck
 */
const mockExternalData = {
  products: [
    { id: 1, name: "Product 1", price: 99.99, image: "https://picsum.photos/seed/p1/400/300" },
    { id: 2, name: "Product 2", price: 149.99, image: "https://picsum.photos/seed/p2/400/300" },
    { id: 3, name: "Product 3", price: 199.99, image: "https://picsum.photos/seed/p3/400/300" },
    { id: 4, name: "Product 4", price: 249.99, image: "https://picsum.photos/seed/p4/400/300" },
  ],
  user: {
    name: "John Doe",
    email: "john@example.com",
  },
  categories: [
    { id: 1, name: "Electronics", icon: "📱" },
    { id: 2, name: "Clothing", icon: "👕" },
    { id: 3, name: "Home & Garden", icon: "🏠" },
  ],
};

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

  // Resolve the source path to get the data
  // Remove "externalData." prefix if present
  const cleanPath = source.startsWith("externalData.")
    ? source.substring("externalData.".length)
    : source;
  
  const resolvedData = cleanPath ? getValueByPath(mockExternalData, cleanPath) : mockExternalData;

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

  // Resolve the source path to get the data
  const cleanPath = source.startsWith("externalData.")
    ? source.substring("externalData.".length)
    : source;
  
  const resolvedData = cleanPath ? getValueByPath(mockExternalData, cleanPath) : mockExternalData;

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
