'use client';

export type Category =
  | '전체'
  | '학교'
  | '대학'
  | '학년'
  | '채용'
  | '활동'
  | '홍보';

export type LocalAttachment = { name: string };

export type LocalNotice = {
  id: string;
  title: string;
  content: string;
  category: Category;
  createdAt: string; // ISO
  attachments: LocalAttachment[];
};
