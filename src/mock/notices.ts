import type { Category } from '@/types/notice';
import type { CrawlPostsResponse } from '@/api/models/CrawlPostsResponse';

export const mockCategories: Category[] = [
  { id: 1, name: '학교' },
  { id: 2, name: '대학' },
  { id: 3, name: '학년' },
  { id: 4, name: '채용' },
  { id: 5, name: '활동' },
  { id: 6, name: '홍보' },
];

export function generateMockApiResponses(
  categories: Category[]
): CrawlPostsResponse[] {
  return categories.flatMap((cat, catIndex) =>
    Array.from({ length: 10 }, (_, i) => ({
      id: i + 1 + catIndex * 10,
      title: `${cat.name} 공지 ${i + 1}`,
      content: `${cat.name} 공지 내용입니다.\n세부 안내 ${i + 1}`,
      createdAt: new Date().toISOString(),
    }))
  );
}
