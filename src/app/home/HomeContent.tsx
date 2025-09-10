'use client';
import React, { useState, useEffect } from 'react';
import styles from './Home.module.css';
import HomeHeaderCategorys from './HomeHeaderCategorys';
import { useNotices } from '@/hooks/useNotices';
import Layout from '@/Components/LayoutDir/Layout';
import { useCategories, CategoryItem } from '@/contexts/CategoryContext';
import SharedNoticeItem from '@/Components/Head/SharedNoticeItem';
import { categoryColors } from '@/constants/categories';

export default function HomeContent() {
  const { items } = useCategories();

  // 초기값: items[0]이 없으면 임시 전체 카테고리
  const [category, setCategory] = useState<CategoryItem>({
    id: '0',
    name: '전체',
    color: categoryColors['전체'],
    notify: false,
    visible: true,
  });

  // items가 로드되면 category 초기화
  useEffect(() => {
    if (items.length > 0) setCategory(items[0]);
  }, [items]);

  const notices = useNotices({
    id: Number(category.id), // string → number
    name: category.name,
  });

  const [readIds, setReadIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // 최근 공지 순 정렬
  const sortedNotices = [...notices].sort(
    (a, b) => b.upload_time.getTime() - a.upload_time.getTime()
  );

  // 로컬스토리지에서 읽은 공지 불러오기
  useEffect(() => {
    setLoading(true);

    try {
      const savedReads = localStorage.getItem('readNotices');
      if (savedReads) setReadIds(JSON.parse(savedReads) as string[]);
    } catch (err) {
      console.warn('로컬스토리지 읽기 실패', err);
      setReadIds([]);
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
