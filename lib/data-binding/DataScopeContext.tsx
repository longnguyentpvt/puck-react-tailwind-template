"use client";

import React, { createContext, useContext, useMemo, useRef, ReactNode } from 'react';
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
  
  // Create a stable reference to serialized values using deep comparison
  const prevVariablesStrRef = useRef<string>('');
  const prevParentScopeStrRef = useRef<string>('');
  
  // Memoize current serialized values to avoid creating new strings on every render
  // These will only change when the object reference changes
  const currentVariablesStr = useMemo(() => JSON.stringify(variables), [variables]);
  const currentParentScopeStr = useMemo(() => JSON.stringify(parentContext.scope), [parentContext.scope]);
  
  // Use useMemo to create stable string references that only change when content differs
  const stableVariablesStr = useMemo(() => {
    if (prevVariablesStrRef.current !== currentVariablesStr) {
      prevVariablesStrRef.current = currentVariablesStr;
      return currentVariablesStr;
    }
    return prevVariablesStrRef.current;
  }, [currentVariablesStr]);
  
  const stableParentScopeStr = useMemo(() => {
    if (prevParentScopeStrRef.current !== currentParentScopeStr) {
      prevParentScopeStrRef.current = currentParentScopeStr;
      return currentParentScopeStr;
    }
    return prevParentScopeStrRef.current;
  }, [currentParentScopeStr]);
  
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stableVariablesStr, stableParentScopeStr]);
  
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
