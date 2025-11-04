import { useState, useEffect } from 'react';
import type { Notice } from '@/types/notice';
import { CrawlPostControllerService } from '@/api/services/CrawlPostControllerService';
import { mapCrawlPostToNotice } from '@/utils/Noticemappers';
import type { Pageable } from '@/api/models/Pageable';
import type { SearchRequestDto } from '@/api/models/SearchRequestDto';
import type { PageListResponse } from '@/api/models/PageListResponse';

export function useBookmarks() {
  const [bookmarkedNotices, setBookmarkedNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [bookmarkIds, setBookmarkIds] = useState<number[]>([]);

  // 로컬스토리지에서 북마크 ID 가져오기
  useEffect(() => {
    const savedBookmarks = JSON.parse(
      localStorage.getItem('bookmarkedIds') || '[]'
    ) as number[];
    setBookmarkIds(savedBookmarks);
  }, []);

  // 북마크 공지 불러오기
  const fetchBookmarkedNotices = async (pageNumber: number) => {
    if (bookmarkIds.length === 0) {
      setBookmarkedNotices([]);
      setHasMore(false);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const pageable: Pageable = {
        page: pageNumber,
        size: 20,
        sort: ['createdAt,DESC'],
      };
      const requestBody: SearchRequestDto = { ids: bookmarkIds };

      const data: PageListResponse =
        await CrawlPostControllerService.searchNoticesByIds(
          pageable,
          requestBody
        );

      const convertedNotices: Notice[] =
        data.content?.map((raw) => {
          const notice = mapCrawlPostToNotice(raw);
          return {
            ...notice,
            upload_time: raw.createdAt ? new Date(raw.createdAt) : new Date(0),
          };
        }) || [];

      if (pageNumber === 0) {
        setBookmarkedNotices(convertedNotices);
      } else {
        setBookmarkedNotices((prev) => [...prev, ...convertedNotices]);
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

  useEffect(() => {
    if (bookmarkIds.length > 0) {
      fetchBookmarkedNotices(0);
    } else {
      setLoading(false);
      setBookmarkedNotices([]);
    }
  }, [bookmarkIds]);

  const loadMore = () => {
    if (hasMore && !loading) {
      fetchBookmarkedNotices(page + 1);
    }
  };

  const refresh = async () => {
    if (loading) return;
    await fetchBookmarkedNotices(0);
  };

  const updateBookmarkIds = (updated: number[]) => {
    localStorage.setItem('bookmarkedIds', JSON.stringify(updated));
    setBookmarkIds(updated);
  };

  return {
    bookmarkedNotices,
    loading,
    hasMore,
    loadMore,
    refresh,
    bookmarkIds,
    updateBookmarkIds,
    setBookmarkedNotices,
  };
}

