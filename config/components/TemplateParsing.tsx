"use client";

import React from 'react';
import { usePayloadDataValue } from '@/config/blocks/PayloadData/context';
import { parseTemplate } from '@/utils/template-parser';

/**
 * Higher-Order Component to add template parsing support to components
 * Wraps component props and parses any string values that contain {{fieldPath}} patterns
 */

export interface WithTemplateParsingProps {
  [key: string]: any;
}

/**
 * Parse props that may contain template patterns
 */
function parsePropsWithTemplate(props: any, data: any): any {
  if (!data) return props;

  const parsed: any = {};

  for (const key in props) {
    const value = props[key];

    if (typeof value === 'string') {
      // Parse template strings
      parsed[key] = parseTemplate(value, data);
    } else if (Array.isArray(value)) {
      // Recursively parse array items
      parsed[key] = value.map((item) =>
        typeof item === 'object' && item !== null
          ? parsePropsWithTemplate(item, data)
          : typeof item === 'string'
          ? parseTemplate(item, data)
          : item
      );
    } else if (typeof value === 'object' && value !== null) {
      // Recursively parse object properties
      parsed[key] = parsePropsWithTemplate(value, data);
    } else {
      // Keep non-string values as-is
      parsed[key] = value;
    }
  }

  return parsed;
}

/**
 * HOC that adds template parsing capability to a component
 */
export function withTemplateParsing<P extends WithTemplateParsingProps>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  const WithTemplateParsingComponent = (props: P) => {
    const payloadData = usePayloadDataValue();

    // If there's no payload data context, render as-is
    if (!payloadData) {
      return <Component {...props} />;
    }

    // Parse props with template patterns
    const parsedProps = parsePropsWithTemplate(props, payloadData);

    return <Component {...parsedProps} />;
  };

  WithTemplateParsingComponent.displayName = `withTemplateParsing(${
    Component.displayName || Component.name || 'Component'
  })`;

  return WithTemplateParsingComponent;
}

/**
 * Hook to get parsed template value
 * Can be used directly in components for more granular control
 */
export function useTemplateParsing(template: string | undefined): string {
  const payloadData = usePayloadDataValue();

  if (!payloadData || !template) {
    return template || '';
  }

  return parseTemplate(template, payloadData);
}
