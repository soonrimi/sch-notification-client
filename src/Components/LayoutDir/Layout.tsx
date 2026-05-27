'use client';
import React, { ReactNode, useState } from 'react';
import Header, { HeaderProps } from '@/Components/Head/Header';
import BottomNav from '@/Components/Bottom/BottomNav';
import styles from './Layout.module.css';

export const HEADER_HEIGHT = 45;
const CATEGORY_HEIGHT = 42;
const HOME_HEADER_HEIGHT = HEADER_HEIGHT + CATEGORY_HEIGHT;
const SEARCH_SLIDER_HEIGHT = 40; // 슬라이더 바 높이
const SEARCH_HEADER_HEIGHT = HEADER_HEIGHT + SEARCH_SLIDER_HEIGHT;
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
    <LayoutContent
      headerProps={headerProps}
      hideBottomNav={hideBottomNav}
      footerSlot={footerSlot}
      backgroundColor={backgroundColor}
      fullHeight={fullHeight}
    >
      {children}
    </LayoutContent>
  );
}

function LayoutContent({
  children,
  headerProps,
  hideBottomNav,
  footerSlot,
  backgroundColor,
  fullHeight = false,
}: LayoutProps) {
  const [isDepartmentPanelOpen, setIsDepartmentPanelOpen] = useState(false);

  const handleDepartmentPanelChange = (open: boolean) => {
    setIsDepartmentPanelOpen(open);
  };
  return (
    <div
      className={styles.layout_container}
      style={{
        backgroundColor: backgroundColor || '#fff',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        className={styles.header_wrapper}
        style={{
          height:
            headerProps?.pageType === 'home'
              ? HOME_HEADER_HEIGHT
              : headerProps?.pageType === 'search' &&
                  headerProps?.scope !== undefined
                ? SEARCH_HEADER_HEIGHT
                : HEADER_HEIGHT,
          flexShrink: 0,
        }}
      >
        {headerProps && (
          <Header
            {...(headerProps.pageType === 'home'
              ? {
                  ...headerProps,
                  homeHeaderProps: headerProps.homeHeaderProps
                    ? {
                        ...headerProps.homeHeaderProps,
                        onDepartmentPanelChange: handleDepartmentPanelChange,
                      }
                    : undefined,
                }
              : headerProps)}
          />
        )}
      </div>

      {/* Main */}
      <div
        className={styles.main_wrapper}
        style={{
          flex: '1 1 auto',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          minHeight: 0,
          marginTop: isDepartmentPanelOpen ? '35px' : '0px',
        }}
      >
        <main
          className={`
            ${styles.main_scroll}
            ${headerProps?.pageType === 'calendar' && styles.main_fixed}
          `}
          style={{
            flex: '1 1 auto',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            minHeight: 0,
            backgroundColor: 'transparent',
          }}
        >
          {children}
        </main>
      </div>

      {/* Footer Slot or Bottom Navigation */}
      {!(hideBottomNav && !footerSlot) && (
        <div
          className={styles.bottom_nav_wrapper}
          style={{
            height: BOTTOM_NAV_HEIGHT,
            flexShrink: 0,
          }}
        >
          {footerSlot ? footerSlot : <BottomNav />}
        </div>
      )}
    </div>
  );
}
