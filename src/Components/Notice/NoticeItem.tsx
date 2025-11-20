'use client';

import React from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import styles from '../../app/home/Home.module.css';
import { Notice } from '@/types/notice';
import { formatUploadTime } from '@/utils/NoticeDate';
import { useRouter } from 'next/navigation';
import { useCategoryColors } from '@/contexts/CategoryColorContext';

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
  const { categoryColors } = useCategoryColors();
  const noticeContent = (
    <div
      className={`${styles.home_notice_content} ${
        BookmarkDeleteMode
          ? styles.home_notice_content_padding_bookmark
          : styles.home_notice_content_padding_normal
      }`}
    >
      <div className={styles.home_notice_body}>
        {currentCategory === '전체' && (
          <div
            className={styles.category_badge}
            style={{
              backgroundColor: categoryColors[notice.category] || '#000',
            }}
          >
            {notice.category}
          </div>
        )}
        <div className={styles.home_notice_title}>{notice.title}</div>

        <div
          className={styles.home_notice_detail}
          dangerouslySetInnerHTML={{ __html: notice.detail ?? '' }}
        />
        <div className={styles.home_notice_info}>
          <div className={styles.home_notice_upload_info}>
            {notice.writer} · {formatUploadTime(notice.upload_time)}
          </div>
        </div>
      </div>
    </div>
  );
  const router = useRouter();
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

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
      className={`${styles.home_notice} ${styles.home_notice_cursor}`}
      style={{
        backgroundColor:
          BookmarkDeleteMode && isSelectedForBookmarkDelete
            ? '#bda10030'
            : 'transparent',
      }}
      onClick={handleClick}
    >
      <div className={styles.home_notice_wrapper}>
        {BookmarkDeleteMode && (
          <div className={styles.bookmark_delete_wrapper}>
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
