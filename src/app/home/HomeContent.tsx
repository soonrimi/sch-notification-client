'use client';
import React, { useState, useEffect } from 'react';
import styles from './Home.module.css';
import HomeHeaderCategorys from './HomeHeaderCategorys';
import { useNotices } from '@/hooks/useNotices';
import Layout from '@/Components/LayoutDir/Layout';
import { useCategories } from '@/contexts/CategoryContext';
import SharedNoticeItem from '@/Components/Head/SharedNoticeItem';

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

    const savedReads = localStorage.getItem('readNotices');
    if (savedReads) setReadIds(JSON.parse(savedReads));

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
              <SharedNoticeItem
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
