'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { allNotices } from '@/mock/notices';
import HomeNotice from '@/app/home/HomeNotice';
import Layout from '@/Components/LayoutDir/Layout';
import { useBookmark } from '@/hooks/useBookmark';
import { Notice } from '@/types/notice';

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
  const scope = searchParams.get('scope') || 'all';

  const [searchKeyword, setSearchKeyword] = useState(keyword);

  useEffect(() => {
    setSearchKeyword(keyword);
  }, [keyword]);

  // scope와 keyword에 따라 필터링
  const results = allNotices.filter((notice) => {
    const matchesKeyword =
      notice.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      notice.detail.toLowerCase().includes(searchKeyword.toLowerCase());

    if (scope === 'bookmark') {
      const savedBookmarks = JSON.parse(
        localStorage.getItem('bookmarkedIds') || '[]'
      );
      return matchesKeyword && savedBookmarks.includes(notice.id);
    }

    return matchesKeyword; // 전체 공지
  });

  const handleBackToSearchInput = () => {
    router.push(`/search?scope=${scope}`);
  };

  const handleSearch = (newKeyword: string) => {
    if (!newKeyword) return;
    setSearchKeyword(newKeyword);
    router.push(
      `/search/results?keyword=${encodeURIComponent(newKeyword)}&scope=${scope}`
    );
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
        {results.length === 0 ? (
          <div>검색 결과가 없습니다.</div>
        ) : (
          results.map((notice) => (
            <NoticeWithBookmark key={notice.id} notice={notice} />
          ))
        )}
      </div>
    </Layout>
  );
}
