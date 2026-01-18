"use client";

import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { DataScope, resolveBindings } from './resolve-binding';

/**
 * Context value for data scope
 */
export interface DataScopeContextValue {
  scope: DataScope;
  /**
   * Resolve binding expressions in a string using the current scope
   */
  resolve: (template: string) => string;
}

/**
 * Context for passing data scope to children recursively.
 * Child components can access parent scope variables.
 */
const DataScopeContext = createContext<DataScopeContextValue>({
  scope: {},
  resolve: (template) => template,
});

DataScopeContext.displayName = 'DataScopeContext';

export interface DataScopeProviderProps {
  /**
   * Additional variables to add to the scope.
   * These will be merged with parent scope, with local values taking precedence (shadowing).
   */
  variables: DataScope;
  children: ReactNode;
}

/**
 * Provider component that adds variables to the data scope.
 * Supports nested providers with variable shadowing.
 */
export function DataScopeProvider({ variables, children }: DataScopeProviderProps) {
  const parentContext = useContext(DataScopeContext);
  
  // Use JSON.stringify for stable comparison of scope objects
  const variablesKey = useMemo(() => JSON.stringify(variables), [variables]);
  const parentScopeKey = useMemo(() => JSON.stringify(parentContext.scope), [parentContext.scope]);
  
  const value = useMemo(() => {
    // Merge parent scope with new variables (new variables shadow parent)
    const mergedScope: DataScope = {
      ...parentContext.scope,
      ...variables,
    };
    
    return {
      scope: mergedScope,
      resolve: (template: string) => resolveBindings(template, mergedScope),
    };
  }, [variablesKey, parentScopeKey]);
  
  return (
    <DataScopeContext.Provider value={value}>
      {children}
    </DataScopeContext.Provider>
  );
}

/**
 * Hook to access the current data scope.
 * Returns the merged scope from all parent DataScopeProviders.
 */
export function useDataScope(): DataScopeContextValue {
  return useContext(DataScopeContext);
}

/**
 * Hook to resolve bindings using the current scope.
 * Convenience wrapper around useDataScope().resolve()
 */
export function useResolveBindings() {
  const { resolve } = useDataScope();
  return resolve;
}

export { DataScopeContext };
