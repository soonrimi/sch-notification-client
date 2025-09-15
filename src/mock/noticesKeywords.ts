import { Notice } from '@/types/notice';

export const mockKeywordNotices: Notice[] = [
  {
    id: 1,
    category: 'ALL',
    upload_time: new Date('2025-08-30T10:00:00'),
    title: '장학금 신청 안내',
    detail: '2025년도 2학기 장학금 신청을 받습니다.',
  },
  {
    id: 2,
    category: 'ALL',
    upload_time: new Date('2025-08-29T14:30:00'),
    title: '인턴 모집 공고',
    detail: 'SW학과 학생 대상 인턴십 모집 안내',
  },
];
