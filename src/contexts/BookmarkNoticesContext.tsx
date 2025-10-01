'use client';
import React, { useState, ReactNode } from 'react';
import type { Notice } from '@/types/notice';

interface BookmarkNoticesContextValue {
  cache: Notice[];
  setCache: (notices: Notice[]) => void;
  clearCache: () => void;
}

export const BookmarkNoticesContext =
  React.createContext<BookmarkNoticesContextValue | null>(null);

export const BookmarkNoticesProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [cache, setCacheState] = useState<Notice[]>([]);

  const setCache = (notices: Notice[]) => {
    setCacheState(notices);
  };

  const clearCache = () => {
    setCacheState([]);
  };

  return (
    <BookmarkNoticesContext.Provider value={{ cache, setCache, clearCache }}>
      {children}
    </BookmarkNoticesContext.Provider>
  );
};
