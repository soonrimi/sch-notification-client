'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { categoryColors } from '@/constants/categories';
import { mockCategories } from '@/mock/notices';
// import { CrawlPostControllerService } from '@/api/services/CrawlPostControllerService';

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
        id: '0',
        name: '전체',
        color: categoryColors['전체'],
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

      // 서버 API 호출 (아직 없으므로 mock)
      try {
        // const serverCategories = await CrawlPostControllerService.getCategories();
        const serverCategories = mockCategories;

        setItems([
          defaultAll,
          ...serverCategories.map((cat) => ({
            id: cat.id.toString(),
            name: cat.name,
            color: categoryColors[cat.name] || '#1d9ad6',
            notify: false,
            visible: true,
          })),
        ]);
      } catch {
        // fallback mock
        setItems([
          defaultAll,
          ...mockCategories.map((cat) => ({
            id: cat.id.toString(),
            name: cat.name,
            color: categoryColors[cat.name] || '#1d9ad6',
            notify: false,
            visible: true,
          })),
        ]);
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
  serverCategories: { id: number; name: string }[] = []
): CategoryItem[] {
  return [
    {
      id: '0',
      name: '전체',
      color: categoryColors['전체'],
      notify: true,
      visible: true,
    },
    ...serverCategories.map((cat) => ({
      id: cat.id.toString(),
      name: cat.name,
      color: categoryColors[cat.name] || '#1d9ad6',
      notify: true,
      visible: true,
    })),
  ];
}
