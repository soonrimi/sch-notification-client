'use client';

import { Suspense } from 'react';
import HomeContent from './HomeContent';
import NoticeDetail from './NoticeDetail';
import { useSearchParams } from 'next/navigation';

function HomePageInner() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  return id ? <NoticeDetail id={id} /> : <HomeContent />;
}

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePageInner />
    </Suspense>
  );
}
