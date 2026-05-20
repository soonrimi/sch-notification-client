import { useState, useEffect, useContext } from 'react';
import type { Notice } from '@/types/notice';
import { CrawlPostControllerService } from '@/api/services/CrawlPostControllerService';
import { AdminControllerService } from '@/api/services/AdminControllerService';
import type { PageListResponse } from '@/api/models/PageListResponse';
import { ApiCategory } from '@/constants/categories';
import { mapCrawlPostToNotice } from '@/utils/Noticemappers';
import type { Pageable } from '@/api/models/Pageable';
import { NoticesContext } from '@/contexts/NoticesContext';
import { CreateInternalNoticeRequest } from '@/api';

export function useNotices(
  selectedCategory: ApiCategory,
  selectedDepartmentName: string | null,
  userDepartmentNames: string[] = []
) {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [departmentIdMap, setDepartmentIdMap] = useState<
    Record<string, number>
  >({});
  const { cache, setCache } = useContext(NoticesContext)!;

  const cacheKey =
    selectedCategory === 'DEPARTMENT' && selectedDepartmentName
      ? undefined
      : selectedCategory;

  const getDepartmentIds = async (departmentNames: string[]) => {
    if (departmentNames.length === 0) return [];

    try {
      let nameToId = departmentIdMap;
      if (Object.keys(nameToId).length === 0) {
        const departments = await AdminControllerService.getAllDepartment();
        nameToId = departments.reduce<Record<string, number>>(
          (acc, department) => {
            acc[department.name] = department.id;
            return acc;
          },
          {}
        );
        setDepartmentIdMap(nameToId);
      }

      return departmentNames
        .map((name) => nameToId[name])
        .filter((id): id is number => typeof id === 'number');
    } catch (error) {
      console.warn('Failed to load departments:', error);
      return [];
    }
  };

  const fetchNotices = async (pageNumber: number, ignoreCache = false) => {
    if (
      pageNumber === 0 &&
      !ignoreCache &&
      cacheKey &&
      cache[cacheKey]?.length
    ) {
      setNotices(cache[cacheKey]!);
      setHasMore(true);
      setPage(0);
      return;
    }

    try {
      setLoading(true);

      let data: PageListResponse | null = null;
      const pageable: Pageable = {
        page: pageNumber,
        size: 20,
        sort: ['createdAt,DESC'],
      };

      if (selectedCategory === 'ALL') {
        data = await CrawlPostControllerService.getAllNotices(
          pageable.page,
          pageable.size,
          pageable.sort
        );
      } else if (
        selectedCategory === 'DEPARTMENT' &&
        selectedDepartmentName !== null
      ) {
        const departmentNames =
          selectedDepartmentName === '전체'
            ? userDepartmentNames
            : [selectedDepartmentName];
        const departmentIds = await getDepartmentIds(departmentNames);

        if (departmentIds.length > 0) {
          data =
            await CrawlPostControllerService.getInitializedNoticesByDepartment(
              pageable,
              departmentIds
            );
        } else {
          data = await CrawlPostControllerService.getNotices(
            selectedCategory as CreateInternalNoticeRequest.category,
            pageable.page,
            pageable.size,
            pageable.sort
          );
        }
      } else {
        data = await CrawlPostControllerService.getNotices(
          selectedCategory as CreateInternalNoticeRequest.category,
          pageable.page,
          pageable.size,
          pageable.sort
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
        if (cacheKey) setCache(cacheKey, convertedNotices);
      } else {
        setNotices((prev) => [...prev, ...convertedNotices]);
        if (cacheKey) {
          setCache(cacheKey, [...(cache[cacheKey] || []), ...convertedNotices]);
        }
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

  // 카테고리 전환 또는 학과 서브카테고리 변경 시
  useEffect(() => {
    if (cacheKey && cache[cacheKey]?.length) {
      // 캐시가 있으면 캐시만 보여줌
      setNotices(cache[cacheKey]!);
      setPage(0);
      setHasMore(true);
    } else {
      // 없을 때만 API 호출
      fetchNotices(0);
    }

    // 스크롤 최상단 이동 (뒤로가기로 복원 중이 아닐 때만)
    const isRestoringScroll = sessionStorage.getItem('homeScrollPosition');
    if (!isRestoringScroll) {
      const scrollContainer = document.getElementById('home_content');
      if (scrollContainer) scrollContainer.scrollTop = 0;
    }
  }, [selectedCategory, selectedDepartmentName, userDepartmentNames.join('|')]);

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
