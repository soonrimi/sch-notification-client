'use client';

import React, { ReactNode } from 'react';
import BottomNav from '@/Components/Bottom/BottomNav';
import Header from '@/Components/Head/Header';
import styles from './Layout.module.css';
import { PageType } from '@/constants/pageTypes';
import clsx from 'clsx';
import NoticeHeader from '@/Components/Head/NoticeHeader';

interface LayoutProps {
  children: ReactNode;
  pageType?: PageType;
  noticeHeaderProps?: React.ComponentProps<typeof NoticeHeader>;
  hideBottomNav?: boolean;
}

const HEADER_HEIGHT = 45;
const BOTTOM_NAV_HEIGHT = 48;

export default function Layout({
  children,
  pageType,
  noticeHeaderProps,
  hideBottomNav,
}: LayoutProps) {
  return (
    <div className={styles.layout_container}>
      {/* Header */}
      <div className={styles.header_wrapper} style={{ height: HEADER_HEIGHT }}>
        <div
          className={styles.header_wrapper}
          style={{ height: HEADER_HEIGHT }}
        >
          {pageType === 'notice' && noticeHeaderProps ? (
            <Header pageType="notice" noticeHeaderProps={noticeHeaderProps} />
          ) : pageType && pageType !== 'notice' ? (
            <Header pageType={pageType} />
          ) : null}
        </div>
      </div>

      {/* Main */}
      <main
        className={clsx(
          styles.main_scroll,
          pageType === 'calendar' && styles.main_fixed
        )}
        style={{
          marginTop: HEADER_HEIGHT,
          marginBottom: BOTTOM_NAV_HEIGHT,
        }}
      >
        {children}
      </main>

      {/* Bottom Navigation */}
      {!hideBottomNav && (
        <div
          className={styles.bottom_nav_wrapper}
          style={{ height: BOTTOM_NAV_HEIGHT }}
        >
          <BottomNav />
        </div>
      )}
    </div>
  );
}
