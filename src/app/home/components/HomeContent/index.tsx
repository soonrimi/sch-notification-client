'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from '../../Home.module.css';
import HomeHeaderCategorys from './HomeHeaderCategorys';
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
import { CircularProgress, Fab } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export function HomeContent() {
  const { items } = useCategories();
  const allCategory: CategoryItem = ALL_CATEGORY;
  const [category, setCategory] = useState<CategoryItem>(allCategory);
  const [categoriesForUI, setCategoriesForUI] = useState<CategoryItem[]>([
    allCategory,
  ]);
  
  // 스크롤 최상단 이동 버튼 관련 상태
  const [showScrollTop, setShowScrollTop] = useState(false);
  const prevScrollPos = useRef(0);

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
      const foundCategory = categoriesForUI.find((c) => c.name === savedCategory);
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
    if (savedScrollPosition && savedCategory === category.name && notices.length > 0 && !loading) {
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

  // 스크롤 이벤트 감지 (위로 스크롤 시 버튼 표시)
  useEffect(() => {
    const scrollContainer = document.getElementById('home_content');
    if (!scrollContainer) return;

    const handleScroll = () => {
      const currentScrollPos = scrollContainer.scrollTop;
      
      // 위로 스크롤 중이고, 100px 이상 스크롤된 경우에만 버튼 표시
      if (prevScrollPos.current > currentScrollPos && currentScrollPos > 100) {
        setShowScrollTop(true);
      } else if (currentScrollPos <= 100 || prevScrollPos.current < currentScrollPos) {
        // 최상단 근처에 있거나 아래로 스크롤 중이면 버튼 숨김
        setShowScrollTop(false);
      }
      
      prevScrollPos.current = currentScrollPos;
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, []);

  // 최상단으로 스크롤
  const scrollToTop = () => {
    const scrollContainer = document.getElementById('home_content');
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
      setShowScrollTop(false);
    }
  };

  return (
    <>
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
                  <NoticeItem
                    key={`${notice.id}-${index}`}
                    notice={notice}
                    isRead={false}
                  />
                ))}
              </InfiniteScroll>
            )}
          </div>
        </div>
      </Layout>

      {/* 스크롤 최상단 이동 버튼 */}
      {showScrollTop && (
        <Fab
          onClick={scrollToTop}
          sx={{
            position: 'fixed',
            bottom: 80,
            right: 20,
            backgroundColor: '#fff',
            color: '#333',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            '&:hover': {
              backgroundColor: '#f5f5f5',
            },
            zIndex: 1000,
          }}
          size="medium"
          aria-label="맨 위로"
        >
          <KeyboardArrowUpIcon />
        </Fab>
      )}
    </>
  );
}
