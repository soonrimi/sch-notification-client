'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DynamicHeaderContextType {
  additionalHeaderHeight: number;
  setAdditionalHeaderHeight: (height: number) => void;
}

const DynamicHeaderContext = createContext<
  DynamicHeaderContextType | undefined
>(undefined);

export function DynamicHeaderProvider({ children }: { children: ReactNode }) {
  const [additionalHeaderHeight, setAdditionalHeaderHeight] = useState(0);

  return (
    <DynamicHeaderContext.Provider
      value={{ additionalHeaderHeight, setAdditionalHeaderHeight }}
    >
      {children}
    </DynamicHeaderContext.Provider>
  );
}

export function useDynamicHeader() {
  const context = useContext(DynamicHeaderContext);
  if (!context) {
    throw new Error(
      'useDynamicHeader must be used within DynamicHeaderProvider'
    );
  }
  return context;
}
