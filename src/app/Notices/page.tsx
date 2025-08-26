'use client';
import React from 'react';
import Layout from '@/Components/LayoutDir/Layout';

export default function Notices() {
  return (
    <Layout headerProps={{ pageType: 'notice' }}>
      <h1>알림 화면입니다</h1>
    </Layout>
  );
}
