'use client';
import React from 'react';
import HomeHeader from './HomeHeader';
import BookmarkHeader from './BookmarkHeader';
import CalendarHeader from './CalendarHeader';
import NoticeHeader, { NoticeHeaderProps } from './NoticeHeader';
import CategorySettingsHeader from './CategorySettingsHeader';
import SearchHeader from './SearchHeader';
import styles from './Header.module.css';

export interface BookmarkHeaderProps {
  selectionMode: boolean;
  selectedCount: number;
  totalCount: number;
  onToggleSelectionMode: () => void;
  onSelectAll: () => void;
  onCancelSelection?: () => void;
}

export type HeaderProps =
  | { pageType: 'home' }
  | { pageType: 'bookmark'; bookmarkProps: BookmarkHeaderProps }
  | { pageType: 'calendar' }
  | {
      pageType: 'notice' | 'contentdetail';
      noticeHeaderProps?: NoticeHeaderProps;
    }
  | { pageType: 'mypage' }
  | {
      pageType: 'categorysettings';
      categoryHeaderProps: { onReset: () => void };
    }
  | {
      pageType: 'search';
      searchKeyword: string;
      setSearchKeyword: (val: string) => void;
      onBack: () => void;
      onSearch?: (keyword: string) => void;
      disableInput?: boolean;
    };

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
      ) : pageType === 'categorysettings' && props.categoryHeaderProps ? (
        <CategorySettingsHeader {...props.categoryHeaderProps} />
      ) : pageType === 'search' ? (
        <SearchHeader
          searchKeyword={props.searchKeyword}
          setSearchKeyword={props.setSearchKeyword}
          onBack={props.onBack}
          onSearch={props.onSearch}
          disableInput={props.disableInput}
        />
      ) : null}
    </div>
  );
}
