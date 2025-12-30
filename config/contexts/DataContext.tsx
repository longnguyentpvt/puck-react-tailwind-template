import React, { createContext, useContext } from 'react';

/**
 * Data Context for passing data from parent components to child components in slots
 * 
 * This solves the problem of child components (like Heading, Text) not having
 * access to data from parent components (like DataRepeater) due to Puck's
 * slot architecture.
 */

export interface DataContextValue<T = any> {
  data: T;
  dataType?: string; // e.g., "pet", "product", "user"
}

const DataContext = createContext<DataContextValue<any> | null>(null);

export interface DataProviderProps {
  children: React.ReactNode;
  data: any;
  dataType?: string;
}

/**
 * Provider component that wraps child content and provides data access
 */
export const DataProvider: React.FC<DataProviderProps> = ({ children, data, dataType }) => {
  return (
    <DataContext.Provider value={{ data, dataType }}>
      {children}
    </DataContext.Provider>
  );
};

/**
 * Hook to access data from parent context
 * Returns null if no data context is available
 */
export const useDataContext = <T = any>(): DataContextValue<T> | null => {
  return useContext(DataContext);
};

/**
 * Hook to get a specific field from the data context
 * @param fieldPath - Dot notation path to field (e.g., "name", "address.city")
 * @param defaultValue - Value to return if field not found
 */
export const useDataField = <T = any>(fieldPath: string, defaultValue: T): T | any => {
  const context = useDataContext();
  
  if (!context || !context.data) {
    return defaultValue;
  }
  
  // Support dot notation for nested fields (e.g., "address.city")
  const fields = fieldPath.split('.');
  let value = context.data;
  
  for (const field of fields) {
    if (value && typeof value === 'object' && field in value) {
      value = value[field];
    } else {
      return defaultValue;
    }
  }
  
  return value !== undefined ? value : defaultValue;
};
