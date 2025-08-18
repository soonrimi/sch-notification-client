'use client';
import React from 'react';
import { PAGE_TYPES, PageType } from '@/constants/pageTypes';
import HomeHeader from './HomeHeader';
import BookmarkHeader from './BookmarkHeader';
import CalendarHeader from './CalendarHeader';
import styles from './Header.module.css';

// 페이지 타입별 헤더를 안전하게 매핑
const HEADER_COMPONENTS: Partial<Record<PageType, React.ElementType>> = {
  home: HomeHeader,
  bookmark: BookmarkHeader,
  calendar: CalendarHeader,
};

interface HeaderProps {
  pageType?: PageType;
}

export default function Header({ pageType }: HeaderProps) {
  if (!pageType) return null;

  const SpecificHeader = HEADER_COMPONENTS[pageType];
  if (!SpecificHeader) return null;

  return (
    <div className={styles.header}>
      <SpecificHeader />
    </div>
  );
}
