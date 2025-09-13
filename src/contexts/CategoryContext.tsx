'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CATEGORY_COLORS, getCategoryName } from '@/constants/categories';
import { CrawlPostsResponse } from '@/api/models/CrawlPostsResponse';

export interface CategoryItem {
  id: string;
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
      const defaultAll: CategoryItem = {
        id: 'all',
        name: '전체',
        color: CATEGORY_COLORS['ALL'],
        notify: false,
        visible: true,
      };

      // localStorage 확인 (카테고리 순서, 알림설정, 색상설정)
      const saved = localStorage.getItem('categories');
      if (saved) {
        const parsed: CategoryItem[] = JSON.parse(saved);
        const hasAll = parsed.some((c) => c.id === '0');
        setItems(hasAll ? parsed : [defaultAll, ...parsed]);
        return;
      }

      try {
        Object.entries(CATEGORY_COLORS).forEach(([key, value]) => {
          setItems((prevItems) => [
            ...prevItems,
            {
              id: key,
              name: getCategoryName(
                key as CrawlPostsResponse['category'] | 'ALL'
              ),
              color: value || '#1d9ad6',
              notify: false,
              visible: true,
            },
          ]);
        });
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

export function getDefaultCategories(
  serverCategories: CrawlPostsResponse.category[] = []
): CategoryItem[] {
  return [
    {
      id: '0',
      name: getCategoryName('ALL'),
      color: CATEGORY_COLORS['ALL'],
      notify: true,
      visible: true,
    },
    ...serverCategories.map((category) => ({
      id: category,
      name: getCategoryName(category),
      color: CATEGORY_COLORS[category] || '#1d9ad6',
      notify: true,
      visible: true,
    })),
  ];
}
