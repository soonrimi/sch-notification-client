'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CATEGORY_COLORS } from '@/constants/categories';

type CategoryColorContextType = {
  categoryColors: Record<string, string>;
  setCategoryColor: (category: string, color: string) => void;
};

const CategoryColorContext = createContext<
  CategoryColorContextType | undefined
>(undefined);

export function CategoryColorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [categoryColors, setCategoryColors] =
    useState<Record<string, string>>(CATEGORY_COLORS);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('categoryColors');
      if (saved) {
        setCategoryColors(JSON.parse(saved));
      }
    }
  }, []);

  const setCategoryColor = (category: string, color: string) => {
    setCategoryColors((prev) => {
      const updated = { ...prev, [category]: color };
      if (typeof window !== 'undefined') {
        localStorage.setItem('categoryColors', JSON.stringify(updated));
      }
      return updated;
    });
  };

  return (
    <CategoryColorContext.Provider value={{ categoryColors, setCategoryColor }}>
      {children}
    </CategoryColorContext.Provider>
  );
}

export function useCategoryColors() {
  const context = useContext(CategoryColorContext);
  if (!context)
    throw new Error(
      'useCategoryColors must be used within CategoryColorProvider'
    );
  return context;
}
