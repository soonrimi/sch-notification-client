'use client';
import React from 'react';
import Link from 'next/link';
import styles from './BottomNav.module.css';

interface BottomNavItemProps {
  href: string;
  label: string;
  Icon: React.ElementType;
  isActive: boolean;
}

export default function BottomNavItem({
  href,
  label,
  Icon,
  isActive,
}: BottomNavItemProps) {
  return (
    <Link
      href={href}
      className={styles.bottomnav_icon}
      aria-current={isActive ? 'page' : undefined}
      aria-label={label}
    >
      <Icon
        sx={{
          fontSize: 25,
          color: isActive ? '#333333' : '#A1A1A1',
        }}
      />
      <span
        className={`
          ${styles.bottomnav_icon_text}
          ${isActive && styles.active_text}
        `}
      >
        {label}
      </span>
    </Link>
  );
}
