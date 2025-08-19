'use client';
import React from 'react';
import Image from 'next/image';
import SettingsIcon from '@mui/icons-material/Settings';
import styles from './Header.module.css';

export default function HomeHeader() {
  return (
    <div className={styles.header_wrapper}>
      <div className={styles.header_right_home}>
        <Image
          src="/icons/search_icon.png"
          alt="검색"
          width={18}
          height={21}
          className={styles.icon_small}
        />
        <SettingsIcon className={styles.icon_settings} />
      </div>
    </div>
  );
}
