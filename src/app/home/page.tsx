'use client';
import { useSearchParams } from 'next/navigation';
import HomeContent from './HomeContent';
import NoticeDetail from './NoticeDetail';

export default function HomePage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id'); // ?id=공지ID 확인

  return id ? <NoticeDetail id={id} /> : <HomeContent />;
}
