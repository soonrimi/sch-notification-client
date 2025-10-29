'use client';
import React, { useState } from 'react';
import Layout, { HEADER_HEIGHT } from '@/Components/LayoutDir/Layout';
import NotificationTabs from './Components/NotificationTabs';
import CategoryTab from './Components/CategoryTab';
import KeywordTab from './Components/KeywordTab';

export default function Notification() {
  const [tab, setTab] = useState<'category' | 'keyword'>('category');

  return (
    <Layout
      headerProps={{
        pageType: 'notification',
      }}
    >
      <div
        style={{
          position: 'fixed',
          top: HEADER_HEIGHT,
          left: 0,
          right: 0,
          zIndex: 10,
          backgroundColor: '#fff',
        }}
      >
        <NotificationTabs value={tab} onChange={setTab} />
      </div>
      <div style={{ marginTop: HEADER_HEIGHT }}>
        {tab === 'category' ? <CategoryTab /> : <KeywordTab />}
      </div>
    </Layout>
  );
}
