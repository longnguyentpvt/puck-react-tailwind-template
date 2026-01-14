"use client";

import React, { ElementType } from "react";
import { ComponentConfig } from "@measured/puck";
import { useDataScope } from "./DataScopeContext";
import { hasBindings } from "./resolve-binding";

/**
 * Recursively resolve bindings in an object's string values
 */
function resolvePropsBindings(
  props: Record<string, unknown>,
  resolve: (template: string) => string
): Record<string, unknown> {
  const resolved: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(props)) {
    if (typeof value === "string" && hasBindings(value)) {
      resolved[key] = resolve(value);
    } else if (value && typeof value === "object" && !React.isValidElement(value)) {
      if (Array.isArray(value)) {
        resolved[key] = value.map((item) => {
          if (typeof item === "string" && hasBindings(item)) {
            return resolve(item);
          }
          if (item && typeof item === "object" && !React.isValidElement(item)) {
            return resolvePropsBindings(item as Record<string, unknown>, resolve);
          }
          return item;
        });
      } else {
        resolved[key] = resolvePropsBindings(value as Record<string, unknown>, resolve);
      }
    } else {
      resolved[key] = value;
    }
  }

  return resolved;
}

/**
 * Higher-Order Component that wraps a component to resolve {{binding}} expressions
 * in its props using the current DataScope context.
 * 
 * @param componentConfig - The Puck component configuration
 * @returns A new component configuration with binding resolution
 */
export function withBindableProps<
  ThisComponentConfig extends ComponentConfig<any> = ComponentConfig
>(componentConfig: ThisComponentConfig): ThisComponentConfig {
  const OriginalRender = componentConfig.render;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const BindableRender: any = (props: any) => {
    const { resolve } = useDataScope();
    
    // Resolve bindings in props (excluding puck and other non-data props)
    const { puck, id, ...dataProps } = props;
    const resolvedDataProps = resolvePropsBindings(dataProps, resolve);
    
    return <OriginalRender {...resolvedDataProps} puck={puck} id={id} />;
  };

  return {
    ...componentConfig,
    render: BindableRender,
  };
}

/**
 * Component that renders text with resolved bindings.
 * Use this to display dynamic content from the data scope.
 */
export function BindableText({ 
  text, 
  className,
  as: Component = "span",
}: { 
  text: string; 
  className?: string;
  as?: ElementType;
}) {
  const { resolve } = useDataScope();
  const resolvedText = resolve(text);
  
  return <Component className={className}>{resolvedText}</Component>;
}
