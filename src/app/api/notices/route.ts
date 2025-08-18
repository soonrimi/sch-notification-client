import { NextResponse } from 'next/server';
import type { Notice } from '@/types/notice';

const categories: Notice['category'][] = [
  '학교',
  '대학',
  '학년',
  '채용',
  '활동',
  '홍보',
];

const noticeDetails: Record<Notice['category'], (i: number) => string> = {
  학교: () =>
    '이번 주 학사 일정 안내입니다. 과제 제출 마감, 시험 일정 등 중요한 정보를 포함하고 있습니다. 자세한 내용은 학사공지 게시판..',
  대학: (i) =>
    `대학 관련 안내사항 ${i + 1}입니다. 장학금 신청, 학과별 세미나 일정, 특별 행사 안내 등 유용한 정보를 포함합니다.`,
  학년: (i) =>
    `학년별 공지 ${i + 1}입니다. 이번 학기 학년별 필수 수업, 평가 일정, 학년 모임 안내 등이 포함되어 있습니다.`,
  채용: (i) =>
    `채용 공고 ${i + 1}입니다. 인턴 모집, 지원 방법, 마감일 및 면접 안내 등 세부사항이 포함됩니다.`,
  활동: (i) =>
    `동아리 및 활동 안내 ${i + 1}입니다. 모임 일정, 참여 방법, 행사 장소 등 활동 관련 정보를 담고 있습니다.`,
  홍보: (i) =>
    `홍보 안내 ${i + 1}입니다. 참여 방법, 일시, 장소, 특별 혜택 등 자세한 내용이 포함됩니다.`,
};

const allNotices: Notice[] = categories.flatMap((cat) =>
  Array.from({ length: 10 }, (_, i) => ({
    id: `${cat}-${i + 1}`,
    category: cat,
    upload_time: `09:${30 + i}`,
    application_period: `07/${25 + i}~07/${31 + i}`,
    title: `${cat} 공지 ${i + 1}`,
    detail: noticeDetails[cat](i),
  }))
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');

  let filtered: Notice[];
  if (category && category !== '전체') {
    filtered = allNotices.filter((n) => n.category === category);
  } else {
    filtered = allNotices;
  }

  return NextResponse.json(filtered);
}
