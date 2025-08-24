'use client';
import React, { useEffect, useState } from 'react';
import styles from './Home.module.css';
import HomeNotice from './HomeNotice';
import HomeHeaderCategorys from './HomeHeaderCategorys';
import { Category } from '@/types/notice';
import type { Notice } from '@/types/notice';
import { getNoticesByCategory } from '@/mock/notices';
import { useBookmark } from '@/hooks/useBookmark';
import { useRouter } from 'next/navigation';
import Layout from '@/Components/LayoutDir/Layout';

export default function HomeContent() {
  const [category, setCategory] = useState<Category>('전체');
  const [notices, setNotices] = useState<Notice[]>([]);
  const [readIds, setReadIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setNotices(getNoticesByCategory(category));

    if (typeof window !== 'undefined') {
      const savedReads = localStorage.getItem('readNotices');
      if (savedReads) setReadIds(JSON.parse(savedReads));
    }

    setLoading(false);
  }, [category]);

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
            notices.map((notice) => (
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
    console.log('클릭한 공지 URL:', url);
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
      />
    </div>
  );
}
