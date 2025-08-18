'use client';
import React, { useEffect, useState } from 'react';
import styles from './Home.module.css';
import HomeNotice from './HomeNotice';
import HomeHeaderCategorys from './HomeHeaderCategorys';
import { Category } from '@/constants/categories';

interface Notice {
  id: string;
  category: string;
  upload_time: string;
  application_period: string;
  title: string;
  detail: string;
}

export default function HomeContent() {
  const [category, setCategory] = useState<Category>('전체');
  const [notices, setNotices] = useState<Notice[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    const fetchNotices = async () => {
      try {
        const res = await fetch(
          `/api/notices?category=${encodeURIComponent(category)}`,
          {
            signal: controller.signal,
          }
        );
        if (!res.ok) throw new Error('API 요청 실패');
        const data: Notice[] = await res.json();
        setNotices(data);

        const saved = localStorage.getItem('bookmarkedIds');
        if (saved) setBookmarkedIds(JSON.parse(saved));
      } catch (e: any) {
        if (e.name !== 'AbortError') console.error('공지 불러오기 오류:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
    return () => controller.abort();
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
