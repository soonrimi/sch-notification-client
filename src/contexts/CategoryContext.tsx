'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CATEGORY_COLORS,
  getCategoryName,
  Category,
  ALL_CATEGORY,
} from '@/constants/categories';

export interface CategoryItem {
  id: Category;
  name: string;
  color: string;
  notify: boolean;
  visible: boolean;
}

interface CategoryContextType {
  items: CategoryItem[];
  setItems: React.Dispatch<React.SetStateAction<CategoryItem[]>>;
}

const CategoryContext = createContext<CategoryContextType | undefined>(
  undefined
);

export function CategoryProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CategoryItem[]>([]);

  useEffect(() => {
    async function initCategories() {
      const defaultAll: CategoryItem = ALL_CATEGORY;

      // localStorage 확인 (카테고리 순서, 알림설정, 색상설정)
      const saved = localStorage.getItem('categories');
      if (saved) {
        const parsed: CategoryItem[] = JSON.parse(saved);
        const hasAll = parsed.some((c) => c.id === 'ALL');
        setItems(hasAll ? parsed : [defaultAll, ...parsed]);
        return;
      }

      try {
        const categoryItems: CategoryItem[] = Object.keys(CATEGORY_COLORS).map(
          (key) => {
            const id = key as Category; // string → Category
            return {
              id,
              name: getCategoryName(id),
              color: CATEGORY_COLORS[id] || '#1d9ad6',
              notify: false,
              visible: true,
            };
          }
        );

        setItems(categoryItems);
      } catch {
        // fallback mock
        setItems([defaultAll]);
      }
    }

    initCategories();
  }, []);

  return (
    <CategoryContext.Provider value={{ items, setItems }}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoryContext);
  if (!context)
    throw new Error('useCategories must be used within a CategoryProvider');
  return context;
}

export function getDefaultCategories(): CategoryItem[] {
  return [
    ALL_CATEGORY,
    ...Object.keys(CATEGORY_COLORS).map((key) => {
      const id = key as Category;
      return {
        id,
        name: getCategoryName(id),
        color: CATEGORY_COLORS[id] || '#1d9ad6',
        notify: true,
        visible: true,
      };
    }),
  ];
}
