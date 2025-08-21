'use client';
import React, { ReactNode } from 'react';
import BottomNav from '@/Components/Bottom/BottomNav';
import Header from '@/Components/Head/Header';
import styles from './Layout.module.css';
import { PageType } from '@/constants/pageTypes';
import clsx from 'clsx';

interface LayoutProps {
  children: ReactNode;
  pageType?: PageType;
}

const HEADER_HEIGHT = 45;
const BOTTOM_NAV_HEIGHT = 48;

export default function Layout({ children, pageType }: LayoutProps) {
  return (
    <div className={styles.layout_container}>
      {/* Header */}
      <div className={styles.header_wrapper} style={{ height: HEADER_HEIGHT }}>
        <Header pageType={pageType} />
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
      <div
        className={styles.bottom_nav_wrapper}
        style={{ height: BOTTOM_NAV_HEIGHT }}
      >
        <BottomNav />
      </div>
    </div>
  );
}
