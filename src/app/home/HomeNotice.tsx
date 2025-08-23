'use client';

import React from 'react';
import Link from 'next/link';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import styles from './Home.module.css';
import { Notice } from '@/types/notice';

interface HomeNoticeProps extends Notice {
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  isRead: boolean;
}

// 카테고리별 색상
const categoryColors: Record<string, string> = {
  전체: '#1d9ad6',
  학교: '#e74c3c',
  대학: '#27ae60',
  학년: '#8e44ad',
  채용: '#f39c12',
  활동: '#16a085',
  홍보: '#d35400',
};

export default function HomeNotice({
  id,
  category,
  upload_time,
  application_period,
  title,
  detail,
  isBookmarked,
  onToggleBookmark,
  isRead,
}: HomeNoticeProps) {
  return (
    <Link
      href={`/home/${encodeURIComponent(id)}`}
      className={styles.home_notice}
    >
      <div className={styles.home_notice_content}>
        {/* 상단 정보 */}
        <div className={styles.home_notice_info}>
          <div
            style={{
              width: 30,
              height: 17,
              borderRadius: '999px',
              fontSize: 10,
              color: '#fff',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 5,
              backgroundColor: categoryColors[category] || '#000',
            }}
          >
            {category}
          </div>
          <div className={styles.home_notice_upload_info}>
            | {upload_time} | 신청: {application_period}
          </div>
        </div>

        {/* 제목 / 내용 */}
        <div className={styles.home_notice_text}>
          <div
            className={`${styles.home_notice_title} ${isRead ? styles.read : ''}`}
          >
            {title}
          </div>
          <div
            className={`${styles.home_notice_detail} ${isRead ? styles.read : ''}`}
          >
            {detail}
          </div>
        </div>
      </div>

      {/* 북마크 버튼 */}
      <div className={styles.home_notic_bookmark}>
        <button
          className={styles.home_notic_bookmark_btn}
          onClick={(e) => {
            e.preventDefault(); // 링크 이동 방지
            onToggleBookmark(id);
          }}
        >
          {isBookmarked ? (
            <BookmarkIcon sx={{ fontSize: 22, color: '#FFD700' }} />
          ) : (
            <BookmarkBorderIcon sx={{ fontSize: 22, color: '#A1A1A1' }} />
          )}
        </button>
      </div>

      {/* 구분선 */}
      <hr className={styles.home_notice_hr} />
    </Link>
  );
}
