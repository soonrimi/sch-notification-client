// // src/contexts/CategoryContext.tsx
// 'use client';
// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { categoryColors } from '@/constants/categories';

// export interface CategoryItem {
//   id: string;
//   name: string;
//   color: string;
//   notify: boolean;
//   visible: boolean;
// }

// interface CategoryContextType {
//   items: CategoryItem[];
//   setItems: React.Dispatch<React.SetStateAction<CategoryItem[]>>;
// }

// const CategoryContext = createContext<CategoryContextType | undefined>(
//   undefined
// );

// export function CategoryProvider({ children }: { children: React.ReactNode }) {
//   const [items, setItems] = useState<CategoryItem[]>([]);

//   const defaultAll: CategoryItem = {
//     id: '0', // 프론트에서 만든 '전체' 카테고리 id
//     name: '전체',
//     color: categoryColors['전체'],
//     notify: false,
//     visible: true,
//   };

//   // 처음 로드될 때 백엔드에서 카테고리 불러오기
//   useEffect(() => {
//     async function fetchCategories() {
//       try {
//         const saved = localStorage.getItem('categories');
//         if (saved) {
//           const parsed: CategoryItem[] = JSON.parse(saved);
//           const hasAll = parsed.some((c) => c.id === '0');
//           setItems(hasAll ? parsed : [defaultAll, ...parsed]);
//           return;
//         }

//         // 백엔드 API 호출
//         const res = await fetch('/api/tag');
//         const tags = await res.json();

//         const backendCategories: CategoryItem[] = tags.map((tag: any) => ({
//           id: tag.id.toString(), // string으로 변환
//           name: tag.name,
//           color:
//             categoryColors[tag.name as keyof typeof categoryColors] ||
//             '#1d9ad6',
//           notify: false,
//           visible: true,
//         }));

//         setItems([defaultAll, ...backendCategories]);
//       } catch (err) {
//         console.error('카테고리 불러오기 실패:', err);

//         // 실패하면 기본 카테고리만 세팅
//         setItems([defaultAll]);
//       }
//     }

//     fetchCategories();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // 저장 시 항상 "전체" 포함
//   useEffect(() => {
//     if (items.length > 0) {
//       const hasAll = items.some((c) => c.id === '0');
//       const toSave = hasAll ? items : [defaultAll, ...items];
//       localStorage.setItem('categories', JSON.stringify(toSave));
//     }
//   }, [items]);

//   return (
//     <CategoryContext.Provider value={{ items, setItems }}>
//       {children}
//     </CategoryContext.Provider>
//   );
// }

// export function useCategories() {
//   const context = useContext(CategoryContext);
//   if (!context) {
//     throw new Error('useCategories must be used within a CategoryProvider');
//   }
//   return context;
// }

// export function getDefaultCategories(): CategoryItem[] {
//   const defaultAll: CategoryItem = {
//     id: '0',
//     name: '전체',
//     color: categoryColors['전체'],
//     notify: true,
//     visible: true,
//   };
//   return [defaultAll]; // 프론트에서 만든 '전체'만 반환
// }
// src/contexts/CategoryContext.tsx
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

      // 1️⃣ localStorage 확인 (카테고리 순서, 알림설정, 색상설정)
      const saved = localStorage.getItem('categories');
      if (saved) {
        const parsed: CategoryItem[] = JSON.parse(saved);
        const hasAll = parsed.some((c) => c.id === '0');
        setItems(hasAll ? parsed : [defaultAll, ...parsed]);
        return;
      }

      // 2️⃣ 서버 API 호출 (아직 없으므로 mock)
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
        // 3️⃣ fallback mock
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

