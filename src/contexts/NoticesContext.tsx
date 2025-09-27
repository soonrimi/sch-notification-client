'use client';
import React, { useState, ReactNode } from 'react';
import type { Notice } from '@/types/notice';
import { ApiCategory } from '@/constants/categories';

type NoticesCache = {
  [category in ApiCategory]?: Notice[];
};

interface NoticesContextValue {
  cache: NoticesCache;
  setCache: (category: ApiCategory, notices: Notice[]) => void;
}

export const NoticesContext = React.createContext<NoticesContextValue | null>(
  null
);

export const NoticesProvider = ({ children }: { children: ReactNode }) => {
  const [cache, setCacheState] = useState<NoticesCache>({});

  const setCache = (category: ApiCategory, notices: Notice[]) => {
    setCacheState((prev) => ({ ...prev, [category]: notices }));
  };

  return (
    // cache, setCache를 앱 전체(Provider 하위)에 공급
    <NoticesContext.Provider value={{ cache, setCache }}>
      {children}
    </NoticesContext.Provider>
  );
};
