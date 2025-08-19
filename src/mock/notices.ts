import type { Notice, Category } from '@/types/notice';

/**
 * 카테고리 정의
 */
export const categories: Category[] = [
  '전체',
  '학교',
  '대학',
  '학년',
  '채용',
  '활동',
  '홍보',
];

/**
 * 카테고리별 더미 공지 내용
 */
const noticeDetails: Record<Category, (i: number) => string> = {
  전체: () => '',
  학교: () => '이번 주 학사 일정 안내입니다...',
  대학: (i) => `대학 관련 안내사항 ${i + 1}입니다...`,
  학년: (i) => `학년별 공지 ${i + 1}입니다...`,
  채용: (i) => `채용 공고 ${i + 1}입니다...`,
  활동: (i) => `동아리 및 활동 안내 ${i + 1}입니다...`,
  홍보: (i) => `홍보 안내 ${i + 1}입니다...`,
};

/**
 * 전체 공지 데이터 생성
 */
export const allNotices: Notice[] = categories
  .filter((cat) => cat !== '전체')
  .flatMap((cat) =>
    Array.from({ length: 10 }, (_, i) => ({
      id: `${cat}-${i + 1}`,
      category: cat,
      upload_time: `09:${30 + i}`,
      application_period: `07/${25 + i}~07/${31 + i}`,
      title: `${cat} 공지 ${i + 1}`,
      detail: noticeDetails[cat](i),
    }))
  );

/**
 * 카테고리별 공지 필터링
 * @param category Category | '전체'
 */
export function getNoticesByCategory(category: Category): Notice[] {
  if (category === '전체') return allNotices;
  return allNotices.filter((n) => n.category === category);
}
