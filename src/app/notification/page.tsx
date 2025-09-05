'use client';
import React, { useState } from 'react';
import Layout from '@/Components/LayoutDir/Layout';
import NotificationTabs from './Components/NotificationTabs';
import CategoryTab from './Components/CategoryTab';
import KeywordTab from './Components/KeywordTab';

export default function Notices() {
  const [tab, setTab] = useState<'category' | 'keyword'>('category');

  return (
    <Layout headerProps={{ pageType: 'notification' }}>
      <NotificationTabs value={tab} onChange={setTab} />
      {tab === 'category' ? <CategoryTab /> : <KeywordTab />}
    </Layout>
  );
}
