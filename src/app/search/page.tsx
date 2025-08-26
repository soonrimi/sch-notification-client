'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RecentSearch from './RecentSearch';
import Layout from '@/Components/LayoutDir/Layout';

export default function SearchPage() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [recentKeywords, setRecentKeywords] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('recentSearch');
    if (saved) setRecentKeywords(JSON.parse(saved));
  }, []);

  const handleSearch = (keyword: string) => {
    if (!keyword) return;

    // 최근검색어 업데이트
    const newList = [
      keyword,
      ...recentKeywords.filter((k) => k !== keyword),
    ].slice(0, 10);
    setRecentKeywords(newList);
    localStorage.setItem('recentSearch', JSON.stringify(newList));

    router.push(`/search/results?keyword=${encodeURIComponent(keyword)}`);
  };

  const handleSelectRecent = (keyword: string) => {
    handleSearch(keyword);
  };

  const handleDeleteRecent = (keyword: string) => {
    const newList = recentKeywords.filter((k) => k !== keyword);
    setRecentKeywords(newList);
    localStorage.setItem('recentSearch', JSON.stringify(newList));
  };

  const handleDeleteAll = () => {
    setRecentKeywords([]);
    localStorage.removeItem('recentSearch');
  };

  const handleBack = () => {
    router.push('/home');
  };

  return (
    <Layout
      headerProps={{
        pageType: 'search',
        searchKeyword: searchKeyword,
        setSearchKeyword: setSearchKeyword,
        onBack: handleBack,
        onSearch: handleSearch,
      }}
      hideBottomNav
    >
      <RecentSearch
        recentKeywords={recentKeywords}
        onSelect={handleSelectRecent}
        onDelete={handleDeleteRecent}
        onDeleteAll={handleDeleteAll}
      />
    </Layout>
  );
}
