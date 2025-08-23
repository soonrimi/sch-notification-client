'use client';
import React from 'react';
import { PageType } from '@/constants/pageTypes';
import HomeHeader from './HomeHeader';
import BookmarkHeader from './BookmarkHeader';
import CalendarHeader from './CalendarHeader';
import NoticeHeader, { NoticeHeaderProps } from './NoticeHeader';
import styles from './Header.module.css';

type NonNoticePageType = Exclude<PageType, 'notice'>;

type HeaderProps =
  | { pageType: 'notice'; noticeHeaderProps: NoticeHeaderProps } // notice면 필수
  | { pageType?: NonNoticePageType; noticeHeaderProps?: never } // notice가 아니면 전달하지 않음
  | { pageType?: undefined; noticeHeaderProps?: never }; // pageType이 없으면 헤더 없음

const HEADER_COMPONENTS: Partial<Record<PageType, React.ElementType>> = {
  home: HomeHeader,
  bookmark: BookmarkHeader,
  calendar: CalendarHeader,
  notice: NoticeHeader,
};

export default function Header(props: HeaderProps) {
  const { pageType } = props;
  if (!pageType) return null;

  const SpecificHeader = HEADER_COMPONENTS[pageType];
  if (!SpecificHeader) return null;

  return (
    <div className={styles.header}>
      {pageType === 'notice' ? (
        <NoticeHeader {...props.noticeHeaderProps} />
      ) : (
        <SpecificHeader />
      )}
    </div>
  );
}
