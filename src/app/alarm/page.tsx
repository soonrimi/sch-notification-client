'use client';
import React from 'react';
import styles from '../page.module.css';
import BottomNav from '../../Components/BottomNav';

export default function Bookmark() {
  return (
    <div className={styles.home_container}>
      <h1>알림 화면입니다</h1>
      {/* 알림 관련 컴포넌트들 */}
      <BottomNav />
    </div>
  );
}
