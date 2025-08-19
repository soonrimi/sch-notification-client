'use client';
import React from 'react';
import Image from 'next/image';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import styles from './Header.module.css';

export default function BookmarkHeader() {
  return (
    <div className={styles.header_wrapper}>
      <span className={styles.bookmark_title}>북마크</span>
      <div className={styles.header_right}>
        <Image
          src="/icons/search_icon.png"
          alt="검색"
          width={18}
          height={21}
          className={styles.icon_small}
        />
        <DeleteOutlineIcon className={styles.icon_delete} />
      </div>
    </div>
  );
}
