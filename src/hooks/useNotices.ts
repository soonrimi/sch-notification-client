'use client';

import { useState, useEffect } from 'react';
import type { Notice, Category } from '@/types/notice';
import { useCategories } from '@/contexts/CategoryContext';
import { CrawlPostControllerService } from '@/api/services/CrawlPostControllerService';
import { generateMockApiResponses, mockCategories } from '@/mock/notices';
import type { CrawlPostsResponse } from '@/api/models/CrawlPostsResponse';

const mockApiResponses = generateMockApiResponses(mockCategories);

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
    fallback ?? { id: 99, name: 'Unknown' }
  );
}

function mapApiResponseToNotice(
  resp: CrawlPostsResponse,
  categoriesList: Category[],
  fallbackCategory: Category
): Notice {
  const rawDate: string | undefined = resp.createdAt;
  const upload_time = rawDate ? new Date(rawDate) : new Date(0);
  console.log('resp.createdAt:', resp.createdAt, 'raw resp:', resp);
  const category =
    categoriesList.find((c) => c.id === Number((resp as any).categoryId)) ??
    fallbackCategory;

  return {
    id: resp.id?.toString() ?? '',
    category,
    upload_time,
    title: resp.title ?? '',
    detail: resp.content ?? '',
  };
}

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
      if (selectedCategory.name === '전체' && notices.length > 0) return;
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
  }, [selectedCategory]);

  return notices;
}
