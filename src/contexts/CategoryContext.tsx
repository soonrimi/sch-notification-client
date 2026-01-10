'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CATEGORY_COLORS,
  Category,
  ALL_CATEGORY,
} from '@/constants/categories';

export interface CategoryItem {
  id: Category;
  name: string;
  color: string;
  notify: boolean;
  visible: boolean;
  subscribeId?: number;
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
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    function initCategories() {
      const defaultAll: CategoryItem = ALL_CATEGORY;

      // localStorage 확인 (카테고리 순서, 알림설정, 색상설정)
      const saved = localStorage.getItem('categories');
      if (saved) {
        try {
          const parsed: CategoryItem[] = JSON.parse(saved);
          const hasAll = parsed.some((c) => c.id === '전체');
          setItems(hasAll ? parsed : [defaultAll, ...parsed]);
          setIsInitialized(true);
          return;
        } catch {
          // 파싱 실패 시 기본값 사용
        }
      }

      try {
        const categoryItems: CategoryItem[] = Object.keys(CATEGORY_COLORS)
          .filter((key) => key !== '전체')
          .map((key) => {
            const id = key as Category;
            return {
              id,
              name: id,
              color: CATEGORY_COLORS[id] || '#1d9ad6',
              notify: false,
              visible: true,
            };
          });

        setItems([defaultAll, ...categoryItems]);
      } catch {
        // fallback mock
        setItems([defaultAll]);
      }
      setIsInitialized(true);
    }

    initCategories();
  }, []);

  // items가 변경될 때마다 localStorage에 저장 (초기화 이후에만)
  useEffect(() => {
    if (isInitialized && items.length > 0) {
      localStorage.setItem('categories', JSON.stringify(items));
    }
  }, [items, isInitialized]);

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
    ...Object.keys(CATEGORY_COLORS)
      .filter((key) => key !== '전체')
      .map((key) => {
        const id = key as Category;
        return {
          id,
          name: id,
          color: CATEGORY_COLORS[id] || '#1d9ad6',
          notify: true,
          visible: true,
        };
      }),
  ];
}
