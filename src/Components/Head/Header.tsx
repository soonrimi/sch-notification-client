'use client';
import React from 'react';
import { PageType } from '@/constants/pageTypes';
import HomeHeader from './HomeHeader';
import BookmarkHeader from './BookmarkHeader';
import CalendarHeader from './CalendarHeader';
import NoticeHeader, { NoticeHeaderProps } from './NoticeHeader';
import styles from './Header.module.css';

export interface BookmarkHeaderProps {
  selectionMode: boolean;
  selectedCount: number;
  totalCount: number;
  onToggleSelectionMode: () => void;
  onSelectAll: () => void;
  onCancelSelection?: () => void;
}

// pageType별 추가 props 정의
type HeaderExtraProps = {
  notice: { noticeHeaderProps: NoticeHeaderProps };
  bookmark: { bookmarkProps: BookmarkHeaderProps };
  home: Record<string, never>;
  calendar: Record<string, never>;
  mypage: Record<string, never>;
};

export type HeaderProps =
  | { pageType: 'home' }
  | { pageType: 'bookmark'; bookmarkProps: BookmarkHeaderProps }
  | { pageType: 'calendar' }
  | {
      pageType: 'notice' | 'contentdetail';
      noticeHeaderProps?: NoticeHeaderProps;
    }
  | { pageType: 'mypage' };

export default function Header(props: HeaderProps) {
  const { pageType } = props;
  if (!pageType) return null;

  return (
    <div className={styles.header}>
      {(pageType === 'notice' || pageType === 'contentdetail') &&
      props.noticeHeaderProps ? (
        <NoticeHeader {...props.noticeHeaderProps} />
      ) : pageType === 'bookmark' && props.bookmarkProps ? (
        <BookmarkHeader {...props.bookmarkProps} />
      ) : pageType === 'home' ? (
        <HomeHeader />
      ) : pageType === 'calendar' ? (
        <CalendarHeader />
      ) : pageType === 'mypage' ? (
        <div>마이페이지 헤더</div>
      ) : null}
    </div>
  );
}
