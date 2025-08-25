'use client';
import React, { useState, useEffect } from 'react';
import styles from './Home.module.css';
import HomeNotice from './HomeNotice';
import HomeHeaderCategorys from './HomeHeaderCategorys';
import type { Notice } from '@/types/notice';
import { useNotices } from '@/hooks/useNotices';
import { useBookmark } from '@/hooks/useBookmark';
import { useRouter } from 'next/navigation';
import Layout from '@/Components/LayoutDir/Layout';
import { useCategories } from '@/contexts/CategoryContext';

export default function HomeContent() {
  const { items } = useCategories();
  const [category, setCategory] = useState(items[0]?.name || '전체');
  const notices = useNotices(category);
  const [readIds, setReadIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const sortedNotices = [...notices].sort(
    (a, b) => b.upload_time.getTime() - a.upload_time.getTime()
  );

  useEffect(() => {
    setLoading(true);
    if (typeof window !== 'undefined') {
      const savedReads = localStorage.getItem('readNotices');
      if (savedReads) setReadIds(JSON.parse(savedReads));
    }
    setLoading(false);
  }, [category, items]);

  return (
    <Layout headerProps={{ pageType: 'home' }}>
      <div className={styles.home_content_wrapper}>
        <HomeHeaderCategorys category={category} setCategory={setCategory} />
        <div className={styles.home_content}>
          {loading ? (
            <div className={styles.loading}>로딩중...</div>
          ) : notices.length === 0 ? (
            <div className={styles.no_notice}>공지 없음</div>
          ) : (
            sortedNotices.map((notice) => (
              <HomeNoticeWrapper
                key={notice.id}
                notice={notice}
                isRead={readIds.includes(notice.id)}
              />
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}

function HomeNoticeWrapper({
  notice,
  isRead,
}: {
  notice: Notice;
  isRead: boolean;
}) {
  const { bookmarked, toggleBookmark } = useBookmark(notice.id);
  const router = useRouter();

  const handleClick = () => {
    const url = `/home?id=${encodeURIComponent(notice.id)}`;
    router.push(url);
  };

  return (
    <div style={{ marginBottom: 0, cursor: 'pointer' }} onClick={handleClick}>
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
        selectionMode={false}
        isSelected={false}
      />
    </div>
  );
}
