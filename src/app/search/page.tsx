import React, { Suspense } from 'react';
import SearchPage from './SearchPage';

export default function Page() {
  return (
    <Suspense fallback={<div>검색 페이지 로딩중...</div>}>
      <SearchPage />
    </Suspense>
  );
}
