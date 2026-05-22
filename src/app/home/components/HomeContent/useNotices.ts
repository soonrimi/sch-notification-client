import { useState, useEffect, useContext } from 'react';
import type { Notice } from '@/types/notice';
import { CrawlPostControllerService } from '@/api/services/CrawlPostControllerService';
import { AdminControllerService } from '@/api/services/AdminControllerService';
import type { PageListResponse } from '@/api/models/PageListResponse';
import { DeptYearBundle } from '@/api/models/DeptYearBundle';
import { ApiCategory } from '@/constants/categories';
import { mapCrawlPostToNotice } from '@/utils/Noticemappers';
import type { Pageable } from '@/api/models/Pageable';
import { NoticesContext } from '@/contexts/NoticesContext';
import { CreateInternalNoticeRequest } from '@/api';
import type { Major } from '@/types/profile';

export function useNotices(
  selectedCategory: ApiCategory,
  selectedSubCategory: string | null,
  userDepartmentNames: string[] = [],
  userMajors: Major[] = []
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
    (selectedCategory === 'DEPARTMENT' || selectedCategory === 'GRADE') &&
    selectedSubCategory
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

  const getGradeBundles = async (
    subCategory: string
  ): Promise<DeptYearBundle[]> => {
    if (subCategory === '전체') {
      const serviceYearMap: Record<string, DeptYearBundle.targetYear> = {
        '1학년': DeptYearBundle.targetYear.FIRST_YEAR,
        '2학년': DeptYearBundle.targetYear.SECOND_YEAR,
        '3학년': DeptYearBundle.targetYear.THIRD_YEAR,
        '4학년': DeptYearBundle.targetYear.FOURTH_YEAR,
        '5학년': DeptYearBundle.targetYear.FIFTH_YEAR,
      };

      const bundles = await Promise.all(
        userMajors.map(async (major) => {
          const departmentIds = await getDepartmentIds([major.name]);
          return departmentIds.map((departmentId) => ({
            departmentId,
            targetYear:
              serviceYearMap[major.grade] ??
              DeptYearBundle.targetYear.ALL_YEARS,
          }));
        })
      );

      return bundles.flat();
    }

    const lastSpaceIndex = subCategory.lastIndexOf(' ');
    if (lastSpaceIndex < 0) {
      return [];
    }

    const departmentName = subCategory.slice(0, lastSpaceIndex);
    const gradeLabel = subCategory.slice(lastSpaceIndex + 1);

    const yearMap: Record<string, DeptYearBundle.targetYear> = {
      전체: DeptYearBundle.targetYear.ALL_YEARS,
      '1학년': DeptYearBundle.targetYear.FIRST_YEAR,
      '2학년': DeptYearBundle.targetYear.SECOND_YEAR,
      '3학년': DeptYearBundle.targetYear.THIRD_YEAR,
      '4학년': DeptYearBundle.targetYear.FOURTH_YEAR,
      '5학년': DeptYearBundle.targetYear.FIFTH_YEAR,
    };

    const targetYear =
      yearMap[gradeLabel] ?? DeptYearBundle.targetYear.ALL_YEARS;
    const departmentIds = await getDepartmentIds([departmentName]);
    return departmentIds.map((departmentId) => ({
      departmentId,
      targetYear,
    }));
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
        selectedSubCategory !== null
      ) {
        const departmentNames =
          selectedSubCategory === '전체'
            ? userDepartmentNames
            : [selectedSubCategory];
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
      } else if (selectedCategory === 'GRADE' && selectedSubCategory !== null) {
        const gradeBundles = await getGradeBundles(selectedSubCategory);
        if (gradeBundles.length > 0) {
          data =
            await CrawlPostControllerService.getInitializedNoticesByDepartmentAndYear(
              pageable,
              gradeBundles
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
  }, [selectedCategory, selectedSubCategory, userDepartmentNames.join('|')]);

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
