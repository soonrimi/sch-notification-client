// src/contexts/CategoryContext.tsx
'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { categories, categoryColors } from '@/constants/categories';

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

  const defaultAll: CategoryItem = {
    id: 'all',
    name: '전체',
    color: categoryColors['전체'],
    notify: false,
    visible: true,
  };

  // 처음 로드될 때 localStorage에서 불러오기
  useEffect(() => {
    const saved = localStorage.getItem('categories');
    if (saved) {
      const parsed: CategoryItem[] = JSON.parse(saved);
      const hasAll = parsed.some((c) => c.id === 'all');
      setItems(hasAll ? parsed : [defaultAll, ...parsed]);
    } else {
      setItems([
        defaultAll, // 항상 '전체' 상단 고정
        ...categories.map((cat) => ({
          id: cat,
          name: cat,
          color: categoryColors[cat] || '#1d9ad6',
          notify: false,
          visible: true,
        })),
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 저장 시 항상 "전체" 포함
  useEffect(() => {
    if (items.length > 0) {
      const hasAll = items.some((c) => c.id === 'all');
      const toSave = hasAll ? items : [defaultAll, ...items];
      localStorage.setItem('categories', JSON.stringify(toSave));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  return (
    <CategoryContext.Provider value={{ items, setItems }}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
}

export function getDefaultCategories(): CategoryItem[] {
  return [
    {
      id: 'all',
      name: '전체',
      color: categoryColors['전체'],
      notify: true,
      visible: true,
    },
    ...categories.map((cat) => ({
      id: cat,
      name: cat,
      color: categoryColors[cat] || '#1d9ad6',
      notify: true,
      visible: true,
    })),
  ];
}
