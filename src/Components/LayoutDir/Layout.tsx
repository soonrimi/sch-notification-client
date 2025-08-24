'use client';
import React, { ReactNode } from 'react';
import Header, { HeaderProps } from '@/Components/Head/Header';
import BottomNav from '@/Components/Bottom/BottomNav';
import styles from './Layout.module.css';
import clsx from 'clsx';

const HEADER_HEIGHT = 45;
const BOTTOM_NAV_HEIGHT = 48;

interface LayoutProps {
  children: ReactNode;
  headerProps?: HeaderProps;
  hideBottomNav?: boolean;
  footerSlot?: ReactNode;
}

export default function Layout({
  children,
  headerProps,
  hideBottomNav,
  footerSlot,
}: LayoutProps) {
  return (
    <div className={styles.layout_container}>
      {/* Header */}
      <div className={styles.header_wrapper} style={{ height: HEADER_HEIGHT }}>
        {headerProps && <Header {...headerProps} />}
      </div>

      {/* Main */}
      <main
        className={clsx(
          styles.main_scroll,
          headerProps?.pageType === 'calendar' && styles.main_fixed
        )}
        style={{
          marginTop: HEADER_HEIGHT,
          marginBottom: BOTTOM_NAV_HEIGHT,
        }}
      >
        {children}
      </main>

      {/* Footer Slot or Bottom Navigation */}
      <div
        className={styles.bottom_nav_wrapper}
        style={{ height: BOTTOM_NAV_HEIGHT }}
      >
        {footerSlot
          ? footerSlot
          : !hideBottomNav && <BottomNav />}
      </div>
    </div>
  );
}
