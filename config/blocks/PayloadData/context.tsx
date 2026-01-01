"use client";

import React, { createContext, useContext } from 'react';

/**
 * Context for PayloadData component
 * Provides data to descendant components for template parsing
 */

export interface PayloadDataContextValue {
  data: any;
  index?: number;
  isRepeating?: boolean;
}

const PayloadDataContext = createContext<PayloadDataContextValue | null>(null);

export function PayloadDataProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: PayloadDataContextValue;
}) {
  return (
    <PayloadDataContext.Provider value={value}>
      {children}
    </PayloadDataContext.Provider>
  );
}

export function usePayloadData(): PayloadDataContextValue | null {
  return useContext(PayloadDataContext);
}

export function usePayloadDataValue(): any {
  const context = useContext(PayloadDataContext);
  return context?.data;
}
