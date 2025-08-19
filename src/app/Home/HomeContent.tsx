'use client';
import React, { useEffect, useState } from 'react';
import styles from './Home.module.css';
import HomeNotice from './HomeNotice';
import HomeHeaderCategorys from './HomeHeaderCategorys';
import { Category } from '@/types/notice';
import type { Notice } from '@/types/notice';
import { getNoticesByCategory } from '@/mock/notices';

export default function HomeContent() {
  const [category, setCategory] = useState<Category>('전체');
  const [notices, setNotices] = useState<Notice[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);

    const data = getNoticesByCategory(category);
    setNotices(data);

    // 로컬스토리지에서 북마크 불러오기
    const saved = localStorage.getItem('bookmarkedIds');
    if (saved) setBookmarkedIds(JSON.parse(saved));

    setLoading(false);
  }, [category]);

  const handleToggleBookmark = (id: string) => {
    const newBookmarked = bookmarkedIds.includes(id)
      ? bookmarkedIds.filter((x) => x !== id)
      : [...bookmarkedIds, id];
    setBookmarkedIds(newBookmarked);
    localStorage.setItem('bookmarkedIds', JSON.stringify(newBookmarked));
  };

  return (
    <div className={styles.home_content_wrapper}>
      <HomeHeaderCategorys category={category} setCategory={setCategory} />
      <div className={styles.home_content}>
        {loading ? (
          <div className={styles.loading}>로딩중...</div>
        ) : notices.length === 0 ? (
          <div className={styles.no_notice}>공지 없음</div>
        ) : (
          notices.map((notice) => (
            <HomeNotice
              key={notice.id}
              {...notice}
              isBookmarked={bookmarkedIds.includes(notice.id)}
              onToggleBookmark={handleToggleBookmark}
            />
          ))
        )}
      </div>
    </div>
  );
}
