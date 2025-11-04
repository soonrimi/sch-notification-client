'use client';

import React, { useState, useEffect } from 'react';
import styles from '../../Home.module.css';
import { useNotices } from './useNotices';
import type { Notice } from '@/types/notice';
import Layout from '@/Components/LayoutDir/Layout';
import { useCategories, CategoryItem } from '@/contexts/CategoryContext';
import NoticeItem from '@/Components/Notice/NoticeItem';
import {
  ALL_CATEGORY,
  ApiCategory,
  CATEGORY_LABELS,
} from '@/constants/categories';
import InfiniteScroll from 'react-infinite-scroll-component';
import ScrollToTop from '@/Components/ScrollToTop/ScrollToTop';
import RefreshLoader from '@/Components/RefreshLoader/RefreshLoader';

export function HomeContent() {
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

  // 저장된 카테고리 복원
  useEffect(() => {
    const savedCategory = sessionStorage.getItem('homeCategory');
    if (savedCategory && categoriesForUI.length > 1) {
      const foundCategory = categoriesForUI.find(
        (c) => c.name === savedCategory
      );
      if (foundCategory && foundCategory.id !== category.id) {
        setCategory(foundCategory);
      }
    }
  }, [categoriesForUI]);

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

  // 스크롤 위치 복원
  useEffect(() => {
    const savedScrollPosition = sessionStorage.getItem('homeScrollPosition');
    const savedCategory = sessionStorage.getItem('homeCategory');

    // 저장된 카테고리와 현재 카테고리가 일치하고, 공지가 로드되었을 때만 스크롤 복원
    if (
      savedScrollPosition &&
      savedCategory === category.name &&
      notices.length > 0 &&
      !loading
    ) {
      const scrollContainer = document.getElementById('home_content');
      if (scrollContainer) {
        // 약간의 지연을 두고 스크롤 복원 (DOM 렌더링 완료 대기)
        setTimeout(() => {
          scrollContainer.scrollTop = parseInt(savedScrollPosition, 10);
          // 복원 후 sessionStorage 정리
          sessionStorage.removeItem('homeScrollPosition');
          sessionStorage.removeItem('homeCategory');
        }, 100);
      }
    }
  }, [notices, loading, category.name]);

  return (
    <>
      <Layout
        headerProps={{
          pageType: 'home',
          homeHeaderProps: {
            category,
            setCategory,
            categories: categoriesForUI,
          },
        }}
      >
        <div className={styles.home_content_wrapper}>

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
                scrollThreshold="120px"
                loader={<div className={styles.loading}>로딩중...</div>}
                scrollableTarget="home_content"
                pullDownToRefresh={true}
                pullDownToRefreshThreshold={60}
                refreshFunction={refresh}
                pullDownToRefreshContent={<RefreshLoader />}
                releaseToRefreshContent={<RefreshLoader primary />}
              >
                {notices.map((notice: Notice, index) => (
                  <NoticeItem
                    key={`${notice.id}-${index}`}
                    notice={notice}
                    isRead={false}
                    currentCategory={category.name}
                  />
                ))}
              </InfiniteScroll>
            )}
          </div>
        </div>
      </Layout>

      {/* 스크롤 최상단 이동 버튼 */}
      <ScrollToTop scrollableTargetId="home_content" />
    </>
  );
}
