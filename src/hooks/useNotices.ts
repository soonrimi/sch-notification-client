'use client';

import { useState, useEffect } from 'react';
import type { Notice } from '@/types/notice';
import { CrawlPostControllerService } from '@/api/services/CrawlPostControllerService';
import type { PageListResponse } from '@/api/models/PageListResponse';
import { ApiCategory, BackendCategory } from '@/constants/categories';
import { mapCrawlPostToNotice } from '@/utils/Noticemappers';
import type { Pageable } from '@/api/models/Pageable';

export function useNotices(selectedCategory: ApiCategory) {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchNotices = async (pageNumber: number) => {
    try {
      setLoading(true);
      console.log('fetchNotices called -> page:', pageNumber);
      console.log('fetchNotices -> selectedCategory:', selectedCategory);

      let data: PageListResponse | null = null;

      const pageable: Pageable = { page: pageNumber };
      if (selectedCategory === 'ALL') {
        data = await CrawlPostControllerService.getAllNotices(pageable);
      } else {
        data = await CrawlPostControllerService.getNotices(
          pageable,
          selectedCategory as BackendCategory
        );
      }

      console.log(
        'API response length:',
        data?.content?.length ?? 'no content'
      );
      console.log('API response totalPages:', data?.totalPages);
      console.log('API response last:', data?.last);

      let convertedNotices =
        data.content?.map((raw) => {
          const notice = mapCrawlPostToNotice(raw);
          return { ...notice, upload_time: new Date(notice.upload_time) };
        }) || [];
      console.log(
        `Received ${convertedNotices.length} notices for page ${pageNumber}`
      );

      if (pageNumber === 0) {
        // 첫 로드 시 기존 데이터를 덮어씀 (카테고리 변경 시)
        setNotices(convertedNotices);
      } else {
        setNotices((prevResults) => [...prevResults, ...convertedNotices]);
      }

      setHasMore(pageNumber + 1 < (data.totalPages || 0));
      setPage(pageNumber);
    } catch (err) {
      console.warn('API 실패:', err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Category changed to:', selectedCategory);
    fetchNotices(0);
  }, [selectedCategory]);

  // 무한 스크롤 로드 함수
  const loadMore = () => {
    // 로딩 중이 아닐 때만 데이터 요청
    if (hasMore && !loading) {
      console.log(`Loading more notices - next page: ${page + 1}`);
      fetchNotices(page + 1);
    } else {
      console.log('loadMore skipped - loading:', loading, 'hasMore:', hasMore);
    }
  };

  return { notices, loading, hasMore, loadMore };
}
