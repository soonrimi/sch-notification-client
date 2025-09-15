'use client';

import { useState, useEffect } from 'react';
import type { Notice } from '@/types/notice';
import { CrawlPostControllerService } from '@/api/services/CrawlPostControllerService';
import type { CrawlPostsResponse } from '@/api/models/CrawlPostsResponse';
import { Category } from '@/constants/categories';
import { mapCrawlPostToNotice } from '@/utils/Noticemappers';

export function useNotices(selectedCategory: Category) {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotices() {
      setLoading(true);
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

      // 서버에서 받은 문자열 upload_time을 Date로 변환
      const convertedNotices: Notice[] = data.map((raw) => {
        const notice = mapCrawlPostToNotice(raw);
        return {
          ...notice,
          upload_time: new Date(notice.upload_time),
        };
      });

      setNotices(convertedNotices);
      setLoading(false);
    }

    fetchNotices();
  }, [selectedCategory]);

  return { notices, loading };
}
