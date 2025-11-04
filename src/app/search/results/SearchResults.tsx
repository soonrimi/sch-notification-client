'use client';
import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Layout from '@/Components/LayoutDir/Layout';
import NoticeItem from '@/Components/Notice/NoticeItem';
import type { Notice } from '@/types/notice';
import InfiniteScroll from 'react-infinite-scroll-component';
import RefreshLoader from '@/Components/RefreshLoader/RefreshLoader';
import ScrollToTop from '@/Components/ScrollToTop/ScrollToTop';
import { useSearchResults } from './hooks/useSearchResults';
import SearchTabSlider from './SearchTabSlider';
import styles from './SearchResults.module.css';

export default function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const keyword = searchParams.get('keyword') || '';
  const scope = searchParams.get('scope');
  const { results, loading, hasMore, loadMore, refresh } = useSearchResults(
    keyword,
    scope === 'calendar' ? null : scope // 캘린더일 때는 검색 결과 조회하지 않음
  );

  const handleBackToSearchInput = () => {
    router.push(`/search`);
  };

  const handleSearch = (newKeyword: string) => {
    if (!newKeyword) return;
    router.push(`/search/results?keyword=${encodeURIComponent(newKeyword)}`);
  };

  return (
    <Layout
      headerProps={{
        pageType: 'search',
        searchKeyword: keyword,
        setSearchKeyword: () => {},
        onBack: handleBackToSearchInput,
        onSearch: handleSearch,
        disableInput: true,
        scope,
      }}
      hideBottomNav
    >
      <div className={styles.container}>
        <div id="search_result_content" className={styles.content}>
          {scope === 'calendar' ? (
            // 캘린더 탭 선택 시 빈 화면 (다른 팀원이 구현 예정)
            null
          ) : results.length === 0 && loading ? (
            <div className={styles.loading}>로딩중...</div>
          ) : results.length === 0 ? (
            <div className={styles.no_notice}>공지 없음</div>
          ) : (
            <InfiniteScroll
              dataLength={results.length}
              next={loadMore}
              hasMore={hasMore}
              scrollThreshold="120px"
              loader={<div className={styles.loading}>로딩중...</div>}
              pullDownToRefresh={true}
              scrollableTarget="search_result_content"
              pullDownToRefreshThreshold={60}
              refreshFunction={refresh}
              pullDownToRefreshContent={<RefreshLoader />}
            >
              {results.map((notice: Notice, index) => (
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
      <ScrollToTop scrollableTargetId="search_result_content" bottom={48} />
    </Layout>
  );
}
