import { useState, useEffect, useContext } from 'react';
import type { Notice } from '@/types/notice';
import { CrawlPostControllerService } from '@/api/services/CrawlPostControllerService';
import type { PageListResponse } from '@/api/models/PageListResponse';
import { ApiCategory, BackendCategory } from '@/constants/categories';
import { mapCrawlPostToNotice } from '@/utils/Noticemappers';
import type { Pageable } from '@/api/models/Pageable';
import { NoticesContext } from '@/contexts/NoticesContext';
import { CreateInternalNoticeRequest } from '@/api';

export function useNotices(selectedCategory: ApiCategory) {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { cache, setCache } = useContext(NoticesContext)!;

  const fetchNotices = async (pageNumber: number, ignoreCache = false) => {
    if (pageNumber === 0 && !ignoreCache && cache[selectedCategory]?.length) {
      setNotices(cache[selectedCategory]!);
      setHasMore(true);
      setPage(0);
      return;
    }

    try {
      setLoading(true);

      let data: PageListResponse | null = null;

      if (selectedCategory === 'ALL') {
        data = await CrawlPostControllerService.getAllNotices(
          pageable.page,
          20,
          ['createdAt,DESC']
        );
      } else {
        data = await CrawlPostControllerService.getNotices(
          selectedCategory as CreateInternalNoticeRequest.category,
          pageable.page,
          20,
          ['createdAt,DESC']
        );
      }

      const convertedNotices: Notice[] =
        data.content?.map((raw) => {
          const notice = mapCrawlPostToNotice(raw);
          return {
            ...notice,
            upload_time: raw.createdAt ? new Date(raw.createdAt) : new Date(0),
          };
        }) || [];

      if (pageNumber === 0) {
        setNotices(convertedNotices);
        setCache(selectedCategory, convertedNotices);
      } else {
        setNotices((prev) => [...prev, ...convertedNotices]);
        setCache(selectedCategory, [
          ...(cache[selectedCategory] || []),
          ...convertedNotices,
        ]);
      }

      setHasMore(pageNumber + 1 < (data.totalPages ?? 1));
      setPage(pageNumber);
    } catch (err) {
      console.warn('API 실패:', err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // 카테고리 전환 시
  useEffect(() => {
    if (cache[selectedCategory]?.length) {
      // 캐시가 있으면 캐시만 보여줌
      setNotices(cache[selectedCategory]!);
      setPage(0);
      setHasMore(true);
    } else {
      // 없을 때만 API 호출
      fetchNotices(0);
    }

    // 스크롤 최상단 이동
    const scrollContainer = document.getElementById('home_content');
    if (scrollContainer) scrollContainer.scrollTop = 0;
  }, [selectedCategory]);

  const loadMore = () => {
    if (hasMore && !loading) fetchNotices(page + 1);
  };

  // 당겨서 새로고침 시에만 강제 API 호출
  const refresh = async () => {
    if (loading) return;
    await fetchNotices(0, true); // 캐시 무시
  };

  return { notices, loading, hasMore, loadMore, refresh };
}
