import type { CalendarEvent } from '@/types/calendar';

export const DUMMY_EVENTS: CalendarEvent[] = [
  {
    id: 1,
    title: '광복절',
    start: '2025-08-15T00:00:00+09:00',
    end: '2025-08-15T23:59:59+09:00',
    allDay: true,
    category: 'holiday',
  },
  {
    id: 2,
    title: '2학기 수강신청 시작',
    start: '2025-08-20T09:00:00+09:00',
    end: '2025-08-20T18:00:00+09:00',
    category: 'academic',
  },
  {
    id: 3,
    title: '기말고사',
    start: '2025-08-26T09:00:00+09:00',
    end: '2025-08-28T17:00:00+09:00',
    category: 'evaluation',
  },
  {
    id: 4,
    title: '하계 계절학기 종강',
    start: '2025-07-30T09:00:00+09:00',
    end: '2025-07-30T12:00:00+09:00',
    category: 'seasonal',
  },
  {
    id: 5,
    title: '입학식',
    start: '2025-07-30T09:00:00+09:00',
    end: '2025-07-30T12:00:00+09:00',
    category: 'etc',
  },
  {
    id: 6,
    title: '개교기념일',
    start: '2025-07-30T09:00:00+09:00',
    end: '2025-07-30T12:00:00+09:00',
    category: 'holiday',
  },
  {
    id: 7,
    title: '수강신청',
    start: '2025-07-30T09:00:00+09:00',
    end: '2025-07-30T12:00:00+09:00',
    category: 'academic',
  },
  {
    id: 8,
    title: '2학기 개강일',
    start: '2025-09-01T09:00:00+09:00',
    end: '2025-09-01T12:00:00+09:00',
    category: 'etc',
  },
  {
    id: 9,
    title: '복학신청',
    start: '2025-07-30T09:00:00+09:00',
    end: '2025-07-30T12:00:00+09:00',
    category: 'academic',
  },
];
