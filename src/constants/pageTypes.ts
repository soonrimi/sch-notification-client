export const PAGE_TYPES = {
  HOME: 'home',
  BOOKMARK: 'bookmark',
  CALENDAR: 'calendar',
  NOTICE: 'notice',
  MYPAGE: 'mypage',
} as const;

export type PageType = (typeof PAGE_TYPES)[keyof typeof PAGE_TYPES];
