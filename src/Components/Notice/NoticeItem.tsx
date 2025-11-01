'use client';

import React from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import styles from '../../app/home/Home.module.css';
import { Notice } from '@/types/notice';
import { CATEGORY_COLORS } from '@/constants/categories';
import { formatUploadTime } from '@/utils/NoticeDate';
import { useRouter } from 'next/navigation';

interface NoticeItemProps {
  notice: Notice;
  isRead: boolean;
  BookmarkDeleteMode?: boolean;
  isSelectedForBookmarkDelete?: boolean;
  onSelectToggle?: (id: number) => void;
  hrefBuilder?: (id: number) => string;
  currentCategory?: string; // 현재 선택된 카테고리
}

export default function NoticeItem({
  notice,
  isRead,
  BookmarkDeleteMode = false,
  isSelectedForBookmarkDelete = false,
  onSelectToggle,
  hrefBuilder = (id) => `/home?id=${encodeURIComponent(id)}`,
  currentCategory,
}: NoticeItemProps) {
  const noticeContent = (
    <div className={styles.home_notice_content}>
      <div className={styles.home_notice_body}>
        <div className={styles.home_notice_title}>{notice.title}</div>

        <div
          className={styles.home_notice_detail}
          dangerouslySetInnerHTML={{ __html: notice.detail ?? '' }}
        />
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
              backgroundColor: CATEGORY_COLORS[notice.category] || '#000',
            }}
          >
            {notice.category}
          </div>
          <div className={styles.home_notice_upload_info}>
            | {formatUploadTime(notice.upload_time)} | {notice.writer}
          </div>
        </div>
      </div>
    </div>
  );
  const router = useRouter();
  const handleClick = () => {
    if (BookmarkDeleteMode) {
      onSelectToggle?.(notice.id);
    } else {
      // 현재 스크롤 위치와 카테고리 저장
      const scrollContainer = document.getElementById('home_content');
      if (scrollContainer) {
        sessionStorage.setItem(
          'homeScrollPosition',
          scrollContainer.scrollTop.toString()
        );
        // 현재 선택된 카테고리를 저장 (공지의 카테고리가 아님)
        sessionStorage.setItem(
          'homeCategory',
          currentCategory || notice.category
        );
      }
      router.push(hrefBuilder(notice.id));
    }
  };
  return (
    <div
      className={styles.home_notice}
      style={{
        backgroundColor:
          BookmarkDeleteMode && isSelectedForBookmarkDelete
            ? '#bda10030'
            : 'transparent',
        cursor: 'pointer',
      }}
      onClick={handleClick}
    >
      <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        {BookmarkDeleteMode && (
          <div
            style={{
              width: 0,
              marginRight: 0,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            {isSelectedForBookmarkDelete ? (
              <CheckCircleIcon
                className={styles.selection_circle}
                sx={{ color: '#bda100ff', fontSize: 22 }}
              />
            ) : (
              <RadioButtonUncheckedIcon
                className={styles.selection_circle}
                sx={{ color: '#A1A1A1', fontSize: 22 }}
              />
            )}
          </div>
        )}

        {noticeContent}
      </div>

      <hr className={styles.home_notice_hr} />
    </div>
  );
}