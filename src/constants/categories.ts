import { CategoryItem } from '@/contexts/CategoryContext';
import { CrawlPostControllerService } from '@/api';

export type BackendCategory = NonNullable<
  Parameters<typeof CrawlPostControllerService.getNotices>[1]
>;

export const CATEGORY_LABELS: Record<BackendCategory | 'ALL', string> = {
  ALL: '전체',
  UNIVERSITY: '대학',
  DEPARTMENT: '학과',
  GRADE: '학년',
  RECRUIT: '채용',
  ACTIVITY: '활동',
  PROMOTION: '홍보',
};

export const CATEGORY_COLORS: Record<Category, string> = {
  전체: '#7986CC',
  대학: '#69B054',
  학과: '#EA9E5A',
  학년: '#F17298',
  채용: '#81AAE8',
  활동: '#B192E7',
  홍보: '#A9A9A9',
};

export type Category = (typeof CATEGORY_LABELS)[keyof typeof CATEGORY_LABELS];
export type ApiCategory = keyof typeof CATEGORY_LABELS;

export const ALL_CATEGORY: CategoryItem = {
  id: '전체',
  name: '전체',
  color: CATEGORY_COLORS['전체'],
  notify: false,
  visible: true,
};
