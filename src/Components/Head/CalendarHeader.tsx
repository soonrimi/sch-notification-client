'use client';
import React from 'react';
import Image from 'next/image';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import styles from './Header.module.css';

export default function CalendarHeader() {
  const today = new Date().getDate();

  return (
    <div className={styles.header_wrapper}>
      <ArrowBackIosIcon
        className={styles.icon_back}
        onClick={() => window.history.back()}
      />
      <div className={styles.header_right}>
        <Image
          src="/icons/search_icon.png"
          alt="검색"
          width={18}
          height={21}
          className={styles.icon_small}
        />
        <div className={styles.today_box}>{today}</div>
      </div>
    </div>
  );
}
