'use client';
import React from 'react';
import styles from '../page.module.css';
import BottomNav from '../../Components/BottomNav';

export default function Bookmark() {
  return (
    <div className={styles.home_container}>
      <h1>북마크 화면입니다</h1>
      {/* 북마크 관련 컴포넌트들 */}
      <BottomNav />
    </div>
  );
}
