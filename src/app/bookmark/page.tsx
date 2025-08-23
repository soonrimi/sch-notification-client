'use client';
import React, { useEffect, useState } from 'react';
import styles from '../page.module.css';
import HomeNotice from '../home/HomeNotice';
import Layout from '../../Components/LayoutDir/Layout';
import { Category } from '@/types/notice';
import type { Notice } from '@/types/notice';
import { getNoticesByCategory } from '@/mock/notices';
import { useBookmark } from '@/hooks/useBookmark';

export default function Bookmark() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [readIds, setReadIds] = useState<string[]>([]);

  // 전체 공지 불러오기
  useEffect(() => {
    const data = getNoticesByCategory('전체' as Category);
    setNotices(data);

    // 읽은 공지 로컬스토리지에서 가져오기
    const savedReads = localStorage.getItem('readNotices');
    if (savedReads) setReadIds(JSON.parse(savedReads));
  }, []);

  return (
    <Layout pageType="bookmark">
      <div className={styles.page_content}>
        {notices.filter((n) => {
          const savedBookmarks = JSON.parse(
            localStorage.getItem('bookmarkedIds') || '[]'
          );
          return savedBookmarks.includes(n.id);
        }).length === 0 ? (
          <div>북마크된 공지가 없습니다.</div>
        ) : (
          notices
            .filter((n) => {
              const savedBookmarks = JSON.parse(
                localStorage.getItem('bookmarkedIds') || '[]'
              );
              return savedBookmarks.includes(n.id);
            })
            .map((notice) => (
              <BookmarkNoticeWrapper
                key={notice.id}
                notice={notice}
                isRead={readIds.includes(notice.id)}
              />
            ))
        )}
      </div>
    </Layout>
  );
}

// 훅 적용된 개별 공지 컴포넌트
function BookmarkNoticeWrapper({
  notice,
  isRead,
}: {
  notice: Notice;
  isRead: boolean;
}) {
  const { bookmarked, toggleBookmark } = useBookmark(notice.id);

  return (
    <HomeNotice
      id={notice.id}
      category={notice.category}
      upload_time={notice.upload_time}
      application_period={notice.application_period}
      title={notice.title}
      detail={notice.detail}
      isBookmarked={bookmarked}
      onToggleBookmark={toggleBookmark}
      isRead={isRead}
    />
  );
}
