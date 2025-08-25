import type { Notice, Category } from '@/types/notice';
import { categories } from '@/constants/categories';

const noticeDetails: Record<Category, (i: number) => string> = {
  전체: () => '',
  학교: (i) =>
    `이번 주 학사 일정 안내입니다.\n`.repeat(50) +
    `추가 안내사항 ${i + 1}입니다.`,
  대학: (i) =>
    `대학 관련 안내사항입니다.\n`.repeat(50) + `상세 내용 ${i + 1} 참고하세요.`,
  학년: (i) =>
    `학년별 공지 내용입니다.\n`.repeat(50) + `세부 안내 ${i + 1}입니다.`,
  채용: (i) =>
    `채용 공고 관련 내용입니다.\n`.repeat(50) + `지원 안내 ${i + 1}입니다.`,
  활동: (i) =>
    `동아리 및 활동 안내입니다.\n`.repeat(50) + `활동 상세 ${i + 1}입니다.`,
  홍보: (i) =>
    `홍보 안내 내용입니다.\n`.repeat(50) + `추가 홍보 ${i + 1}입니다.`,
};

export const allNotices: Notice[] = categories
  .filter((cat) => cat !== '전체')
  .flatMap((cat) =>
    Array.from({ length: 10 }, (_, i) => {
      const now = new Date();
      const uploadTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        9, // 시
        30 + i, // 분
        0 // 초
      );

      return {
        id: `${cat}-${i + 1}`,
        category: cat,
        upload_time: uploadTime,
        application_period: `07/${25 + i}~07/${31 + i}`,
        title: `${cat} 공지 ${i + 1}`,
        detail: noticeDetails[cat](i),
        isRead: false,
      };
    })
  );
