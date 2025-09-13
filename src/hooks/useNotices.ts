'use client';

import { useState, useEffect } from 'react';
import type { Notice } from '@/types/notice';
import { useCategories } from '@/contexts/CategoryContext';
import { CrawlPostControllerService } from '@/api/services/CrawlPostControllerService';
import type { CrawlPostsResponse } from '@/api/models/CrawlPostsResponse';
import { Category } from '@/constants/categories';

export function useNotices(selectedCategory: Category) {
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    async function fetchNotices() {
      if (notices.length > 0) return;
      let data: CrawlPostsResponse[] = [];

      try {
        if (selectedCategory === 'ALL') {
          data = await CrawlPostControllerService.getAllNotices();
        } else {
          data =
            await CrawlPostControllerService.getNoticesByCategoryId(
              selectedCategory
            );
        }
      } catch {
        console.warn('API 실패 → Mock 데이터 사용');
      }

      setNotices(data as unknown as Notice[]);
    }

    fetchNotices();
  }, [selectedCategory]);

  return { notices };
}
