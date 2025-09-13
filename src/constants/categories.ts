import { CrawlPostsResponse } from '@/api';

export const CATEGORY_COLORS: Record<
  CrawlPostsResponse.category | 'ALL',
  string
> = {
  ALL: '#7986CC', // ✅ 전체도 색상 필요
  UNIVERSITY: '#69B054',
  DEPARTMENT: '#EA9E5A',
  GRADE: '#F17298',
  RECRUIT: '#81AAE8',
  ACTIVITY: '#B192E7',
  PROMOTION: '#A9A9A9',
};

export function getCategoryName(
  category: CrawlPostsResponse['category'] | 'ALL'
) {
  switch (category) {
    case 'ALL':
      return '전체';
    case CrawlPostsResponse.category.UNIVERSITY:
      return '대학';
    case CrawlPostsResponse.category.DEPARTMENT:
      return '학과';
    case CrawlPostsResponse.category.GRADE:
      return '학년';
    case CrawlPostsResponse.category.RECRUIT:
      return '채용';
    case CrawlPostsResponse.category.ACTIVITY:
      return '활동';
    case CrawlPostsResponse.category.PROMOTION:
      return '홍보';
    default:
      return '알 수 없음';
  }
}
