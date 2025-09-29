'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Layout from '@/Components/LayoutDir/Layout';
import NoticeItem from '@/Components/Notice/NoticeItem';
import type { Notice } from '@/types/notice';
import { CrawlPostControllerService } from '@/api/services/CrawlPostControllerService';
import { mapCrawlPostToNotice } from '@/utils/Noticemappers';
import type { Pageable } from '@/api/models/Pageable';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CircularProgress } from '@mui/material';
import styles from '../../home/Home.module.css';

export default function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const keyword = searchParams.get('keyword') || '';
  const scope = searchParams.get('scope');
  const [results, setResults] = useState<Notice[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchData = async (pageNumber: number) => {
    try {
      setLoading(true);
      console.log(`Fetching page ${pageNumber}`);

      const pageable: Pageable = { page: pageNumber };
      const res = await CrawlPostControllerService.searchNotices(
        keyword,
        pageable
      );
      let notices = res.content?.map(mapCrawlPostToNotice) || [];

      console.log(`Received ${notices.length} notices for page ${pageNumber}`);

      if (scope === 'bookmark') {
        const saved = JSON.parse(localStorage.getItem('bookmarkedIds') || '[]');
        notices = notices.filter((notice) => saved.includes(notice.id));
      }

      if (pageNumber === 0) {
        // 첫 로드 시 기존 데이터를 덮어씀
        setResults(notices);
      } else {
        setResults((prevResults) => [...prevResults, ...notices]);
      }

      setHasMore(pageNumber + 1 < (res.totalPages ?? 1));
      setPage(pageNumber);
    } catch (error) {
      console.error('Failed to fetch notices:', error);
      setHasMore(false);
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  // 검색어나 scope 변경 시 첫 페이지부터 데이터 로드
  useEffect(() => {
    if (!keyword) return;
    fetchData(0); // 새 검색 시 첫 페이지부터 데이터 로드
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, scope]);

  // 무한 스크롤 로드 함수
  const loadMore = () => {
    // 로딩 중이 아닐 때만 데이터 요청
    if (hasMore && !loading) {
      console.log(`Loading more - next page: ${page + 1}`);
      fetchData(page + 1);
    }
  };

  const SearchReaultsRefresh = async () => {
    console.log('SearchReaultsRefresh!');
    if (loading) return;
    await fetchData(0);
  };

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
      }}
      hideBottomNav
    >
      <div
        style={{
          height: '95vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          id="search_result_content"
          style={{
            flex: '1 1 auto',
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
            overscrollBehavior: 'contain',
            overflow: 'auto',
            height: '100vh',
            paddingTop: 20,
          }}
        >
          {results.length === 0 && loading ? (
            <div className={styles.loading}>로딩중...</div>
          ) : results.length === 0 ? (
            <div className={styles.no_notice}>공지 없음</div>
          ) : (
            <InfiniteScroll
              dataLength={results.length}
              next={loadMore}
              hasMore={hasMore}
              loader={<div className={styles.loading}>로딩중...</div>}
              pullDownToRefresh={true}
              scrollableTarget="search_result_content"
              pullDownToRefreshThreshold={60}
              refreshFunction={SearchReaultsRefresh}
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
    </Layout>
  );
}
