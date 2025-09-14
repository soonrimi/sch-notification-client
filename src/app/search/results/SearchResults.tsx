'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Layout from '@/Components/LayoutDir/Layout';
import HomeNotice from '@/app/home/HomeNotice';
import { useBookmark } from '@/hooks/useBookmark';
import type { Notice } from '@/types/notice';
import { CrawlPostControllerService } from '@/api/services/CrawlPostControllerService';
import { mapCrawlPostToNotice } from '@/utils/Noticemappers';

function NoticeWithBookmark({ notice }: { notice: Notice }) {
  const { bookmarked, toggleBookmark } = useBookmark(notice.id);

  return (
    <HomeNotice
      key={notice.id}
      {...notice}
      isBookmarked={bookmarked}
      onToggleBookmark={toggleBookmark}
      isRead={false}
    />
  );
}

export default function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const keyword = searchParams.get('keyword') || '';

  const [searchKeyword, setSearchKeyword] = useState(keyword);
  const [results, setResults] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSearchKeyword(keyword);
  }, [keyword]);

  useEffect(() => {
    setLoading(true);
    CrawlPostControllerService.searchNotices(searchKeyword)
      .then((res) => setResults(res.map(mapCrawlPostToNotice)))
      .finally(() => setLoading(false));
  }, [searchKeyword]);

  const handleBackToSearchInput = () => {
    router.push(`/search`);
  };

  const handleSearch = (newKeyword: string) => {
    if (!newKeyword) return;
    setSearchKeyword(newKeyword);
    router.push(`/search/results?keyword=${encodeURIComponent(newKeyword)}`);
  };

  return (
    <Layout
      headerProps={{
        pageType: 'search',
        searchKeyword,
        setSearchKeyword,
        onBack: handleBackToSearchInput,
        onSearch: handleSearch,
        disableInput: true,
      }}
      hideBottomNav
    >
      <div style={{ paddingTop: 20 }}>
        {loading ? (
          <div>로딩중...</div>
        ) : results.length === 0 ? (
          <div>검색 결과가 없습니다.</div>
        ) : (
          results.map((notice: Notice) => (
            <NoticeWithBookmark key={notice.id} notice={notice} />
          ))
        )}
      </div>
    </Layout>
  );
}
