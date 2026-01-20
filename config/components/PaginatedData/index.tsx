"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ComponentConfig,
  DefaultComponentProps,
  ObjectField,
} from "@measured/puck";
import { DataScopeProvider, DataScope } from "@/lib/data-binding";
import { BINDABLE_COLLECTIONS } from "@/lib/data-binding/bindable-collections";
import { getMockPaginatedData, PaginationMetadata } from "@/lib/data-binding/pagination-data-source";

/**
 * Pagination-aware data binding field props
 */
export type PaginatedDataFieldProps = {
  /**
   * Slug of the Payload collection to use as data source
   */
  source?: string;
  /**
   * Variable name to expose the data as in the scope
   */
  as?: string;
  /**
   * Enable pagination for this data source
   */
  enablePagination?: boolean;
  /**
   * Default page size
   */
  pageSize?: number;
};

export type WithPaginatedData<Props extends DefaultComponentProps> = Props & {
  paginatedData?: PaginatedDataFieldProps;
};

/**
 * Pagination-aware data binding field definition
 */
export const paginatedDataField: ObjectField<PaginatedDataFieldProps> = {
  type: "object",
  label: "Data Binding with Pagination",
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
    enablePagination: {
      type: "radio",
      label: "Enable Pagination",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    pageSize: {
      type: "number",
      label: "Items Per Page",
      min: 1,
      max: 100,
    },
  },
};

/**
 * Props for the PaginatedDataWrapper component
 */
interface PaginatedDataWrapperProps {
  paginatedData?: PaginatedDataFieldProps;
  children: ReactNode;
}

/**
 * PaginatedDataWrapper component that wraps children with paginated data scope.
 * Reads page number from URL query parameters and provides paginated data.
 */
export function PaginatedDataWrapper({ paginatedData, children }: PaginatedDataWrapperProps) {
  const searchParams = useSearchParams();
  const [paginationMetadata, setPaginationMetadata] = useState<PaginationMetadata | null>(null);
  const [pageData, setPageData] = useState<any[]>([]);
  
  // If no data binding is configured, render children directly
  if (!paginatedData || !paginatedData.source || !paginatedData.as) {
    return <>{children}</>;
  }

  const { source, as: variableName, enablePagination = false, pageSize = 10 } = paginatedData;

  // Get current page from URL (default to 1)
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  
  // Fetch paginated data
  useEffect(() => {
    if (!enablePagination) {
      // If pagination is not enabled, just use all mock data
      const allData = getMockPaginatedData(source, 1, 1000).data;
      setPageData(allData);
      setPaginationMetadata(null);
      return;
    }
    
    // Fetch paginated data (using mock data for now)
    const result = getMockPaginatedData(source, currentPage, pageSize);
    setPageData(result.data);
    setPaginationMetadata(result.pagination);
  }, [source, currentPage, pageSize, enablePagination]);

  // Build data scope
  const variables: DataScope = {
    [variableName]: pageData,
  };
  
  // Add pagination metadata to scope if pagination is enabled
  if (enablePagination && paginationMetadata) {
    variables.pagination = paginationMetadata;
  }

  return (
    <DataScopeProvider variables={variables}>
      {children}
    </DataScopeProvider>
  );
}

/**
 * HOC that adds pagination-aware data binding capabilities to a component
 */
export function withPaginatedData<
  ThisComponentConfig extends ComponentConfig<any> = ComponentConfig
>(componentConfig: ThisComponentConfig): ThisComponentConfig {
  const originalRender = componentConfig.render;

  return {
    ...componentConfig,
    fields: {
      ...componentConfig.fields,
      paginatedData: paginatedDataField,
    },
    defaultProps: {
      ...componentConfig.defaultProps,
      paginatedData: {
        source: "",
        as: "",
        enablePagination: false,
        pageSize: 10,
        ...componentConfig.defaultProps?.paginatedData,
      },
    },
    render: (props) => {
      const paginatedDataProps = props.paginatedData as PaginatedDataFieldProps | undefined;

      // Get the original rendered content
      const content = originalRender(props);

      // Wrap with PaginatedDataWrapper
      return (
        <PaginatedDataWrapper paginatedData={paginatedDataProps}>
          {content}
        </PaginatedDataWrapper>
      );
    },
  };
}
