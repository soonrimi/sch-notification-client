import { useState, useEffect, useContext } from 'react';
import type { Notice } from '@/types/notice';
import { CrawlPostControllerService } from '@/api/services/CrawlPostControllerService';
import type { PageListResponse } from '@/api/models/PageListResponse';
import { ApiCategory, BackendCategory } from '@/constants/categories';
import { mapCrawlPostToNotice } from '@/utils/Noticemappers';
import type { Pageable } from '@/api/models/Pageable';
import { NoticesContext } from '@/contexts/NoticesContext';

export function useNotices(selectedCategory: ApiCategory) {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const { cache, setCache } = useContext(NoticesContext)!;

  const fetchNotices = async (pageNumber: number, ignoreCache = false) => {
    // 첫 페이지이고 캐시가 존재하면 API 호출 생략
    if (pageNumber === 0 && !ignoreCache && cache[selectedCategory]?.length) {
      setNotices(cache[selectedCategory]!);
      setHasMore(true);
      setPage(0);
      return;
    }

    try {
      setLoading(true);

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

      const convertedNotices: Notice[] =
        data.content?.map((raw) => {
          const notice = mapCrawlPostToNotice(raw);
          return {
            ...notice,
            upload_time: raw.createdAt ? new Date(raw.createdAt) : new Date(0), // 1970-01-01T00:00:00.000Z
          };
        }) || [];

      if (pageNumber === 0) {
        setNotices(convertedNotices);
        setCache(selectedCategory, convertedNotices);
      } else {
        setNotices((prev) => [...prev, ...convertedNotices]);
        setCache(selectedCategory, [
          ...(cache[selectedCategory] || []),
          // 새로 받은 페이지의 공지들도 ...(cache[selectedCategory] || []),이거에 합쳐서 펼침.
          ...convertedNotices,
        ]);
      }

      // 전체 페이지 수 기반 hasMore 계산
      setHasMore(pageNumber + 1 < (data.totalPages ?? 1));
      setPage(pageNumber);
    } catch (err) {
      console.warn('API 실패:', err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices(0);
  }, [selectedCategory]);

  const loadMore = () => {
    if (hasMore && !loading) fetchNotices(page + 1);
  };

  const refresh = async () => {
    console.log('refresh!');
    if (loading) return;
    await fetchNotices(0, true); // 캐시 무시하고 새로 API 호출
  };

  return { notices, loading, hasMore, loadMore, refresh };
}
