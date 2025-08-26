'use client';

import React, { Suspense } from 'react';
import SearchResults from './SearchResults';

export default function Page() {
  return (
    <Suspense fallback={<div>검색 결과 불러오는 중...</div>}>
      <SearchResults />
    </Suspense>
  );
}
