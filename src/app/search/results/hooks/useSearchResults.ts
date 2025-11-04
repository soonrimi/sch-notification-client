import { useState, useEffect } from 'react';
import type { Notice } from '@/types/notice';
import { CrawlPostControllerService } from '@/api/services/CrawlPostControllerService';
import { mapCrawlPostToNotice } from '@/utils/Noticemappers';
import type { Pageable } from '@/api/models/Pageable';
import type { SearchRequestDto } from '@/api/models/SearchRequestDto';
import type { PageListResponse } from '@/api/models/PageListResponse';

export function useSearchResults(keyword: string, scope: string | null) {
  const [results, setResults] = useState<Notice[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchData = async (pageNumber: number) => {
    try {
      setLoading(true);

      const pageable: Pageable = {
        page: pageNumber,
        size: 20,
        sort: ['createdAt,DESC'],
      };

      let res: PageListResponse;

      if (scope === 'bookmark') {
        const savedBookmarks = JSON.parse(
          localStorage.getItem('bookmarkedIds') || '[]'
        ) as number[];

        if (savedBookmarks.length === 0) {
          setResults([]);
          setHasMore(false);
          setLoading(false);
          return;
        }

        const requestBody: SearchRequestDto = {
          keyword,
          ids: savedBookmarks,
        };
        res = await CrawlPostControllerService.searchNoticesByIds(
          pageable,
          requestBody
        );
      } else {
        res = await CrawlPostControllerService.searchNotices(
          keyword,
          pageable.page,
          pageable.size,
          pageable.sort
        );
      }

      const notices = res.content?.map(mapCrawlPostToNotice) || [];

      if (pageNumber === 0) {
        setResults(notices);
      } else {
        setResults((prevResults) => [...prevResults, ...notices]);
      }

      setHasMore(pageNumber + 1 < (res.totalPages ?? 1));
      setPage(pageNumber);
    } catch (error) {
      console.error('Failed to fetch notices:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!keyword) return;
    fetchData(0);
  }, [keyword, scope]);

  const loadMore = () => {
    if (hasMore && !loading) {
      fetchData(page + 1);
    }
  };

  const refresh = async () => {
    if (loading) return;
    await fetchData(0);
  };

  return {
    results,
    loading,
    hasMore,
    loadMore,
    refresh,
  };
}

