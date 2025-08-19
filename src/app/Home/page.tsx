'use client';
import Layout from '@/components/Layout/Layout';
import HomeContent from './HomeContent';

export default function HomePage() {
  return (
    <Layout pageType="home">
      <HomeContent />
    </Layout>
  );
}
