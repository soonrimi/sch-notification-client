'use client';
import React from 'react';
import styles from './Home.module.css';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';

const categoryColors = {
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
}) {
  return (
    <div className={styles.home_notice}>
      <div className={styles.home_notice_content}>
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
        <div className={styles.home_notice_text}>
          <div className={styles.home_notice_title}>{title}</div>
          <div className={styles.home_notice_detail}>{detail}</div>
        </div>
      </div>
      <div className={styles.home_notic_bookmark}>
        <button
          className={styles.home_notic_bookmark_btn}
          onClick={() => onToggleBookmark(id)}
        >
          {isBookmarked ? (
            <BookmarkIcon sx={{ fontSize: 18, color: '#FFD700' }} />
          ) : (
            <BookmarkBorderIcon sx={{ fontSize: 18, color: '#A1A1A1' }} />
          )}
        </button>
      </div>
      <div className={styles.home_notice_hr}>
        <hr />
      </div>
    </div>
  );
}
