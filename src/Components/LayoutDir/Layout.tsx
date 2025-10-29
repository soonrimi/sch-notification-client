'use client';
import React, { ReactNode } from 'react';
import Header, { HeaderProps } from '@/Components/Head/Header';
import BottomNav from '@/Components/Bottom/BottomNav';
import styles from './Layout.module.css';

export const HEADER_HEIGHT = 45;
const BOTTOM_NAV_HEIGHT = 48;

interface LayoutProps {
  children: ReactNode;
  headerProps?: HeaderProps;
  hideBottomNav?: boolean;
  footerSlot?: ReactNode;
  backgroundColor?: string;
  fullHeight?: boolean;
  style?: React.CSSProperties;
}

export default function Layout({
  children,
  headerProps,
  hideBottomNav,
  footerSlot,
  backgroundColor,
  fullHeight = false,
}: LayoutProps) {
  return (
    <div
      className={styles.layout_container}
      style={{
        backgroundColor: backgroundColor || '#fff',
        height: fullHeight ? '100vh' : 'auto', // 조건부 적용
      }}
    >
      {/* Header */}
      <div className={styles.header_wrapper} style={{ height: HEADER_HEIGHT }}>
        {headerProps && <Header {...headerProps} />}
      </div>

      {/* Main */}
      <main
        className={`
          ${styles.main_scroll}
          ${headerProps?.pageType === 'calendar' && styles.main_fixed}
        )`}
        style={{
          marginTop: HEADER_HEIGHT,
          marginBottom: BOTTOM_NAV_HEIGHT,
          backgroundColor: 'transparent',
        }}
      >
        {children}
      </main>

      {/* Footer Slot or Bottom Navigation */}
      {!(hideBottomNav && !footerSlot) && (
        <div
          className={styles.bottom_nav_wrapper}
          style={{
            height: BOTTOM_NAV_HEIGHT,
            position: 'fixed',
          }}
        >
          {footerSlot ? footerSlot : <BottomNav />}
        </div>
      )}
    </div>
  );
}
