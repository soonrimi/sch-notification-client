'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import BottomNavItem from './BottomNavItem';
import HomeFilledIcon from '@mui/icons-material/HomeFilled';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import styles from './BottomNav.module.css';

const navItems = [
  { href: '/home', label: '홈', Icon: HomeFilledIcon },
  { href: '/bookmark', label: '북마크', Icon: BookmarkIcon },
  { href: '/notification', label: '알림', Icon: NotificationsIcon },
  { href: '/calendar', label: '달력', Icon: CalendarTodayIcon },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.bottomnav} aria-label="메인 메뉴">
      {navItems.map(({ href, label, Icon }) => (
        <BottomNavItem
          key={href}
          href={href}
          label={label}
          Icon={Icon}
          isActive={pathname.startsWith(href)}
        />
      ))}
    </nav>
  );
}
