import { useMemo } from 'react';
import type { Notice } from '@/types/notice';
import { allNotices } from '@/mock/notices';
import { useCategories } from '@/contexts/CategoryContext';

/**
 * 선택된 카테고리와 Context를 기반으로 공지 필터링
 */
export function useNotices(selectedCategory: string): Notice[] {
  const { items } = useCategories();

  return useMemo(() => {
    const currentCat = items.find((i) => i.name === selectedCategory);
    if (!currentCat || !currentCat.visible) return [];

    if (selectedCategory === '전체') {
      const visibleNames = items.filter((i) => i.visible).map((i) => i.name);
      return allNotices.filter((n) => visibleNames.includes(n.category));
    } else {
      return allNotices.filter((n) => n.category === selectedCategory);
    }
  }, [selectedCategory, items]);
}
