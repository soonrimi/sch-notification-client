// 'use client';
// import { useEffect, useState } from 'react';
// import { Notice } from '@/types/notice';
// import { useCategories } from '@/contexts/CategoryContext';
// import { CrawlPostControllerService } from '@/api/services/CrawlPostControllerService';

// export interface ClientNotice extends Notice {
//   isRead: boolean;
// }

// export const MOCK_DATA = [
//   {
//     id: 100,
//     title: '2025 장학금 신청 안내',
//     content: '장학금입니다',
//     viewCount: 200,
//     attachments: {
//       fileName: '장학금 신청 안내.pdf',
//       fileUrl: 'example.download.html',
//     },
//     published_at: '2025-08-10T09:00:00Z',
//     tags: ['대학'],
//   },
//   // ... 나머지 데이터
// ];

// export function transformResponseToClientNotice(resp: any): ClientNotice {
//   return {
//     id: resp.id.toString(),
//     title: resp.title,
//     detail: resp.content ?? '',
//     category: resp.tags?.[0] ?? '기타',
//     upload_time: new Date(resp.published_at),
//     isRead: false,
//   };
// }

// export function useNotices(selectedCategory: string): ClientNotice[] {
//   const { items } = useCategories();
//   const [notices, setNotices] = useState<ClientNotice[]>([]);

//   useEffect(() => {
//     async function fetchNotices() {
//       try {
//         let data: any[] = [];

//         if (selectedCategory === '전체') {
//           data = await CrawlPostControllerService.getAllNotices();
//         } else {
//           const cat = items.find((i) => i.name === selectedCategory);
//           if (!cat) throw new Error('카테고리 없음');
//           data = await CrawlPostControllerService.getNoticesByCategoryId(
//             Number(cat.id)
//           );
//         }

//         // API 데이터가 정상적일 때만 set
//         if (Array.isArray(data) && data.length > 0) {
//           setNotices(data.map(transformResponseToClientNotice));
//         } else {
//           // 데이터 없으면 Mock fallback
//           const noticeList = MOCK_DATA.map(transformResponseToClientNotice);
//           setNotices(
//             selectedCategory === '전체'
//               ? noticeList
//               : noticeList.filter((n) => n.category === selectedCategory)
//           );
//         }
//       } catch (err) {
//         console.error('API 호출 실패, Mock 데이터 사용:', err);
//         const noticeList = MOCK_DATA.map(transformResponseToClientNotice);
//         setNotices(
//           selectedCategory === '전체'
//             ? noticeList
//             : noticeList.filter((n) => n.category === selectedCategory)
//         );
//       }
//     }

//     fetchNotices();
//   }, [selectedCategory, items]);

//   return notices;
// }
// src/hooks/useNotices.ts
'use client';

import { useState, useEffect } from 'react';
import type { Notice, Category } from '@/types/notice';
import { useCategories } from '@/contexts/CategoryContext';
import { CrawlPostControllerService } from '@/api/services/CrawlPostControllerService';
import {
  generateMockApiResponses,
  mockCategories,
} from '@/mock/notices';
import type { CrawlPostsResponse } from '@/api/models/CrawlPostsResponse';

const mockApiResponses = generateMockApiResponses(mockCategories);

// 선택된 category.name 혹은 category.id 기반으로 Category 객체 안전하게 반환
export function safeCategory(
  catName?: string,
  categoriesList?: Category[],
  fallback?: Category
): Category {
  const validCategories = [
    { id: 0, name: '전체' },
    ...(categoriesList || []),
    { id: 99, name: 'Unknown' },
  ];
  return (
    validCategories.find((c) => c.name === catName) ??
    fallback ??
    { id: 99, name: 'Unknown' }
  );
}

// API Response → Notice
function mapApiResponseToNotice(
  resp: CrawlPostsResponse,
  categoriesList: Category[],
  fallbackCategory: Category
): Notice {
  return {
    id: resp.id?.toString() ?? '',
    category: fallbackCategory,
    upload_time: resp.createdAt ? new Date(resp.createdAt) : new Date(),
    title: resp.title ?? '',
    detail: resp.content ?? '',
  };
}

// 공지 훅
export function useNotices(selectedCategory: Category): Notice[] {
  const [notices, setNotices] = useState<Notice[]>([]);
  const { items: categoryItems } = useCategories();

  const serverCategories: Category[] = categoryItems
    .filter((c) => c.id !== '0')
    .map((c) => ({
      id: Number(c.id),
      name: c.name,
    }));

  useEffect(() => {
    async function fetchNotices() {
      let data: CrawlPostsResponse[] = [];

      try {
        if (selectedCategory.name === '전체') {
          data = await CrawlPostControllerService.getAllNotices();
        } else {
          data = await CrawlPostControllerService.getNoticesByCategoryId(
            Number(selectedCategory.id)
          );
        }
      } catch {
        console.warn('API 실패 → Mock 데이터 사용');
        data = mockApiResponses;
      }

      const noticeList = data.map((resp) =>
        mapApiResponseToNotice(resp, serverCategories, selectedCategory)
      );
      setNotices(noticeList);
    }

    fetchNotices();
  }, [selectedCategory, categoryItems]);

  return notices;
}
