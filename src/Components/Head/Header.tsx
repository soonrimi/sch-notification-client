'use client';
import React from 'react';
import HomeHeader from './HomeHeader';
import BookmarkHeader from './BookmarkHeader';
import CalendarHeader from './CalendarHeader';
import NoticeHeader, { NoticeHeaderProps } from './NoticeHeader';
import SettingsHeader from './CategorySettingsHeader';
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
      pageType: 'notices' | 'contentdetail';
      noticeHeaderProps?: NoticeHeaderProps;
    }
  | { pageType: 'mypage' }
  | {
      pageType: 'settings';
      settingsHeaderProps: { title: string; onReset?: () => void };
    }
  | {
      pageType: 'search';
      searchKeyword: string;
      setSearchKeyword: (val: string) => void;
      onBack: () => void;
      onSearch?: (keyword: string) => void;
      disableInput?: boolean;
    }
  | { pageType: 'notification' };

export default function Header(props: HeaderProps) {
  const { pageType } = props;
  if (!pageType) return null;

  return (
    <div className={styles.header}>
      {(pageType === 'notices' || pageType === 'contentdetail') &&
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
      ) : pageType === 'settings' && props.settingsHeaderProps ? (
        <SettingsHeader {...props.settingsHeaderProps} />
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
