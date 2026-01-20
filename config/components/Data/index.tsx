"use client";

import React, { ReactNode, useState, useEffect } from "react";
import {
  ComponentConfig,
  DefaultComponentProps,
  ObjectField,
} from "@measured/puck";
import { DataScopeProvider, DataScope, getValueByPath } from "@/lib/data-binding";
import { BINDABLE_COLLECTIONS, SWAGGER_API_SOURCES } from "@/lib/data-binding/bindable-collections";
import { getMockData, fetchApiData, getMockApiData } from "@/lib/data-binding/payload-data-source";
import { ApiSourceConfig, ParsedSwagger, ApiEndpoint } from "@/lib/swagger/types";
import { parseSwaggerSpec, findEndpointById, generateExampleFromSchema } from "@/lib/swagger";

/**
 * Data source type
 */
export type DataSourceType = 'collection' | 'api';

/**
 * Data binding field props that can be added to any component
 */
export type DataFieldProps = {
  /**
   * Type of data source (collection or API)
   */
  sourceType?: DataSourceType;
  /**
   * Slug of the Payload collection to use as data source (e.g., "products")
   * Used when sourceType is 'collection'
   */
  source?: string;
  /**
   * API source configuration
   * Used when sourceType is 'api'
   */
  apiSource?: string; // ID from SWAGGER_API_SOURCES
  apiEndpoint?: string; // Endpoint ID
  apiParameters?: string; // JSON string of parameters
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
    sourceType: {
      type: "radio",
      label: "Data Source Type",
      options: [
        { label: "Payload Collection", value: "collection" },
        { label: "Swagger API", value: "api" },
      ],
    },
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
    apiSource: {
      type: "select",
      label: "API Source",
      options: [
        { label: "Select an API...", value: "" },
        ...SWAGGER_API_SOURCES.map(api => ({
          label: api.label,
          value: api.id,
        })),
      ],
    },
    apiEndpoint: {
      type: "text",
      label: "API Endpoint (e.g., GET /products)",
    },
    apiParameters: {
      type: "textarea",
      label: "API Parameters (JSON)",
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
  const [resolvedData, setResolvedData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If no data binding is configured, don't fetch anything
    if (!data || !data.as) {
      setResolvedData(null);
      return;
    }

    const sourceType = data.sourceType || 'collection';

    if (sourceType === 'collection' && data.source) {
      // Fetch from Payload collection (using mock data in client components)
      const collectionData = getMockData(data.source);
      setResolvedData(collectionData);
    } else if (sourceType === 'api' && data.apiSource && data.apiEndpoint) {
      // Fetch from API
      setIsLoading(true);
      fetchApiDataAsync(data)
        .then((apiData) => {
          setResolvedData(apiData);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching API data:', error);
          setResolvedData(null);
          setIsLoading(false);
        });
    } else {
      setResolvedData(null);
    }
  }, [data?.sourceType, data?.source, data?.apiSource, data?.apiEndpoint, data?.apiParameters, data?.as]);

  // If no data or still loading, render children directly
  if (!data || !data.as || isLoading || resolvedData == null) {
    return <>{children}</>;
  }

  // Provide the data to the scope
  const variables: DataScope = {
    [data.as]: resolvedData,
  };

  return (
    <DataScopeProvider variables={variables}>
      {children}
    </DataScopeProvider>
  );
}

/**
 * Async helper to fetch API data
 */
async function fetchApiDataAsync(data: DataFieldProps): Promise<any> {
  if (!data.apiSource || !data.apiEndpoint) {
    return null;
  }

  // Find the API source configuration
  const apiSourceConfig = SWAGGER_API_SOURCES.find((s) => s.id === data.apiSource);
  if (!apiSourceConfig) {
    console.error('API source not found:', data.apiSource);
    return null;
  }

  // Parse parameters from JSON string
  let parameters: Record<string, any> = {};
  if (data.apiParameters) {
    try {
      parameters = JSON.parse(data.apiParameters);
    } catch (error) {
      console.error('Error parsing API parameters:', error);
    }
  }

  // Build API config
  const apiConfig: ApiSourceConfig = {
    type: 'swagger',
    swaggerUrl: apiSourceConfig.swaggerUrl,
    endpointId: data.apiEndpoint,
    parameters,
  };

  // Fetch data from API
  try {
    return await fetchApiData(apiConfig);
  } catch (error) {
    console.error('Error fetching API data:', error);
    // Try to get mock data
    return getMockApiData(apiConfig);
  }
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
        sourceType: "collection",
        source: "",
        apiSource: "",
        apiEndpoint: "",
        apiParameters: "",
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
