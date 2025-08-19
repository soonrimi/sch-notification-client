'use client';
import React, { useEffect, useState } from 'react';
import styles from '../page.module.css';
import HomeNotice from '../Home/HomeNotice';
import Layout from '../../components/Layout/Layout';
import { Category } from '@/types/notice';
import type { Notice } from '@/types/notice';
import { getNoticesByCategory } from '@/mock/notices';

export default function Bookmark() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  // 로컬스토리지에서 북마크 불러오기
  useEffect(() => {
    const saved = localStorage.getItem('bookmarkedIds');
    if (saved) setBookmarkedIds(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const data = getNoticesByCategory('전체' as Category);
    setNotices(data);
  }, []);

  const handleToggleBookmark = (id: string) => {
    const newBookmarked = bookmarkedIds.includes(id)
      ? bookmarkedIds.filter((x) => x !== id)
      : [...bookmarkedIds, id];

    setBookmarkedIds(newBookmarked);
    localStorage.setItem('bookmarkedIds', JSON.stringify(newBookmarked));
  };

  // 북마크된 공지만 필터링
  const bookmarkedNotices = notices.filter((n) => bookmarkedIds.includes(n.id));

  return (
    <Layout pageType="bookmark">
      <div className={styles.page_content}>
        {bookmarkedNotices.length === 0 ? (
          <div>북마크된 공지가 없습니다.</div>
        ) : (
          bookmarkedNotices.map((notice) => (
            <HomeNotice
              key={notice.id}
              {...notice}
              isBookmarked={true}
              onToggleBookmark={handleToggleBookmark}
            />
          ))
        )}
      </div>
    </Layout>
  );
}
