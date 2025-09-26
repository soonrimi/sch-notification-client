'use client';

import React, { useState, useEffect } from 'react';
import styles from './Home.module.css';
import HomeHeaderCategorys from './HomeHeaderCategorys';
import { useNotices } from '@/hooks/useNotices';
import type { Notice } from '@/types/notice';
import Layout from '@/Components/LayoutDir/Layout';
import { useCategories, CategoryItem } from '@/contexts/CategoryContext';
import SharedNoticeItem from '@/Components/Head/SharedNoticeItem';
import {
  ALL_CATEGORY,
  ApiCategory,
  CATEGORY_LABELS,
} from '@/constants/categories';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CircularProgress } from '@mui/material';

export default function HomeContent() {
  const { items } = useCategories();
  const allCategory: CategoryItem = ALL_CATEGORY;
  const [category, setCategory] = useState<CategoryItem>(allCategory);
  const [categoriesForUI, setCategoriesForUI] = useState<CategoryItem[]>([
    allCategory,
  ]);

  useEffect(() => {
    if (items.length > 0) {
      const filteredItems = items.filter((c) => c.id !== '전체');
      setCategoriesForUI([allCategory, ...filteredItems]);
    }
  }, [items]);

  function getBackendCategory(categoryId: string): ApiCategory {
    if (categoryId === '전체') return 'ALL';
    const found = Object.entries(CATEGORY_LABELS).find(
      ([, value]) => value === categoryId
    );
    if (!found) throw new Error(`Unknown category: ${categoryId}`);
    return found[0] as ApiCategory;
  }

  const backendCategory = getBackendCategory(category.id);
  const { notices, loading, hasMore, loadMore, refresh } =
    useNotices(backendCategory);

  // 로컬스토리지에서 읽은 공지 ID
  const [readIds, setReadIds] = useState<number[]>([]);

  useEffect(() => {
    try {
      const savedReads = localStorage.getItem('readNotices');
      if (savedReads) {
        setReadIds(JSON.parse(savedReads).map(Number));
      }
    } catch (err) {
      console.warn('로컬스토리지 읽기 실패', err);
      setReadIds([]);
    }
  }, [category]);

  return (
    <Layout headerProps={{ pageType: 'home' }}>
      <div className={styles.home_content_wrapper}>
        <HomeHeaderCategorys
          category={category}
          setCategory={setCategory}
          categories={categoriesForUI}
        />

        <div id="home_content" className={styles.home_content}>
          {notices.length === 0 && loading ? (
            <div className={styles.loading}>로딩중...</div>
          ) : notices.length === 0 ? (
            <div className={styles.no_notice}>공지 없음</div>
          ) : (
            <InfiniteScroll
              key={backendCategory}
              dataLength={notices.length}
              next={loadMore}
              hasMore={hasMore}
              loader={<div className={styles.loading}>로딩중...</div>}
              scrollableTarget="home_content"
              pullDownToRefresh={true}
              pullDownToRefreshThreshold={60}
              refreshFunction={refresh}
              pullDownToRefreshContent={
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 60,
                  }}
                >
                  <CircularProgress
                    variant="indeterminate"
                    size={24}
                    style={{ color: '#999' }}
                  />
                </div>
              }
              releaseToRefreshContent={
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 60,
                  }}
                >
                  <CircularProgress
                    variant="indeterminate"
                    color="primary"
                    size={24}
                    style={{ color: '#999' }}
                  />
                </div>
              }
            >
              {notices.map((notice: Notice, index) => (
                <SharedNoticeItem
                  key={`${notice.id}-${index}`}
                  notice={notice}
                  isRead={readIds.includes(notice.id)}
                />
              ))}
            </InfiniteScroll>
          )}
        </div>
      </div>
    </Layout>
  );
}
