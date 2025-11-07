'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import RecentSearch from './RecentSearch';
import Layout from '@/Components/LayoutDir/Layout';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialScope = searchParams?.get('scope') || null;
  const from = searchParams?.get('from') || null;
  const [searchKeyword, setSearchKeyword] = useState('');
  const [recentKeywords, setRecentKeywords] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('recentSearch');
    if (saved) setRecentKeywords(JSON.parse(saved));
  }, []);

  const handleSearch = (keyword: string) => {
    if (!keyword) return;

    const newList = [
      keyword,
      ...recentKeywords.filter((k) => k !== keyword),
    ].slice(0, 10);

    setRecentKeywords(newList);
    localStorage.setItem('recentSearch', JSON.stringify(newList));

    // scope가 있으면 URL에 포함 (없으면 일반 검색)
    const queryParams = new URLSearchParams();
    queryParams.set('keyword', keyword);
    if (initialScope) {
      queryParams.set('scope', initialScope);
    }
    router.push(`/search/results?${queryParams.toString()}`);
  };

  const handleSelectRecent = (keyword: string) => handleSearch(keyword);
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
    // from 파라미터에 따라 적절한 페이지로 이동
    if (from === 'bookmark') {
      router.push('/bookmark');
    } else if (from === 'home') {
      router.push('/home');
    } else {
      router.push('/home');
    }
  };

  return (
    <Layout
      headerProps={{
        pageType: 'search',
        searchKeyword,
        setSearchKeyword,
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
