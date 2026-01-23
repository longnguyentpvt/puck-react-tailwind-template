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
export const dataField: any = {
  type: "custom",
  label: "Data Binding",
  render: ({ value, onChange, name }: any) => {
    const currentValue = (value || {}) as DataFieldProps;
    const sourceType = currentValue.sourceType || "collection";
    const [swaggerApis, setSwaggerApis] = useState<Array<{ id: string; label: string }>>([]);
    const [loadingApis, setLoadingApis] = useState(false);

    // Fetch SwaggerApis from Payload when component mounts or when switching to API mode
    useEffect(() => {
      if (sourceType === "api") {
        setLoadingApis(true);
        fetch("/api/swagger-specs")
          .then((res) => res.json())
          .then((data) => {
            if (data.docs) {
              const apis = data.docs
                .filter((doc: any) => doc.enabled !== false)
                .map((doc: any) => ({
                  id: doc.id,
                  label: doc.label,
                }));
              setSwaggerApis(apis);
            }
          })
          .catch((error) => {
            console.error("Error fetching Swagger APIs:", error);
            setSwaggerApis([]);
          })
          .finally(() => {
            setLoadingApis(false);
          });
      }
    }, [sourceType]);

    const updateField = (fieldName: keyof DataFieldProps, fieldValue: any) => {
      onChange({
        ...currentValue,
        [fieldName]: fieldValue,
      });
    };

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Source Type Radio */}
        <div>
          <label style={{ display: "block", marginBottom: "4px", fontWeight: "500" }}>
            Data Source Type
          </label>
          <div style={{ display: "flex", gap: "16px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
              <input
                type="radio"
                value="collection"
                checked={sourceType === "collection"}
                onChange={(e) => updateField("sourceType", "collection")}
              />
              Payload Collection
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
              <input
                type="radio"
                value="api"
                checked={sourceType === "api"}
                onChange={(e) => updateField("sourceType", "api")}
              />
              Swagger API
            </label>
          </div>
        </div>

        {/* Conditional Fields based on Source Type */}
        {sourceType === "collection" ? (
          <>
            {/* Collection Fields */}
            <div>
              <label style={{ display: "block", marginBottom: "4px", fontWeight: "500" }}>
                Data Source Collection
              </label>
              <select
                value={currentValue.source || ""}
                onChange={(e) => updateField("source", e.target.value)}
                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              >
                <option value="">Select a collection...</option>
                {BINDABLE_COLLECTIONS.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </>
        ) : (
          <>
            {/* API Fields */}
            <div>
              <label style={{ display: "block", marginBottom: "4px", fontWeight: "500" }}>
                API Source
              </label>
              <select
                value={currentValue.apiSource || ""}
                onChange={(e) => updateField("apiSource", e.target.value)}
                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                disabled={loadingApis}
              >
                <option value="">
                  {loadingApis ? "Loading..." : swaggerApis.length === 0 ? "No APIs available" : "Select an API..."}
                </option>
                {swaggerApis.map((api) => (
                  <option key={api.id} value={api.id}>
                    {api.label}
                  </option>
                ))}
              </select>
              {!loadingApis && swaggerApis.length === 0 && (
                <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
                  No Swagger APIs found. Add one in the Swagger Apis collection.
                </div>
              )}
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "4px", fontWeight: "500" }}>
                API Endpoint (e.g., GET /products)
              </label>
              <input
                type="text"
                value={currentValue.apiEndpoint || ""}
                onChange={(e) => updateField("apiEndpoint", e.target.value)}
                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "4px", fontWeight: "500" }}>
                API Parameters (JSON)
              </label>
              <textarea
                value={currentValue.apiParameters || ""}
                onChange={(e) => updateField("apiParameters", e.target.value)}
                rows={3}
                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              />
            </div>
          </>
        )}

        {/* Variable Name (always shown) */}
        <div>
          <label style={{ display: "block", marginBottom: "4px", fontWeight: "500" }}>
            Variable Name
          </label>
          <input
            type="text"
            value={currentValue.as || ""}
            onChange={(e) => updateField("as", e.target.value)}
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
        </div>
      </div>
    );
  },
  getItemSummary: (data: DataFieldProps) => {
    if (!data) return "";
    const sourceType = data.sourceType || "collection";
    if (sourceType === "collection" && data.source) {
      return `Collection: ${data.source}${data.as ? ` as ${data.as}` : ""}`;
    } else if (sourceType === "api" && data.apiEndpoint) {
      return `API: ${data.apiEndpoint}${data.as ? ` as ${data.as}` : ""}`;
    }
    return "";
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

  // Find the API source configuration from Payload API
  let apiSourceConfig: { id: string; label: string; swaggerUrl: string } | null = null;
  try {
    const response = await fetch(`/api/swagger-specs?id=${data.apiSource}`);
    if (response.ok) {
      apiSourceConfig = await response.json();
    }
  } catch (error) {
    console.error('Error fetching API source config:', error);
  }

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

  // Fetch data from API using centralized function
  return await fetchApiData(apiConfig);
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
