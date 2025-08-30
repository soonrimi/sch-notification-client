'use client';
import { useEffect, useState } from 'react';
import SharedNoticeItem from '@/Components/Head/SharedNoticeItem';
import type { Notice } from '@/types/notice';
import { mockKeywordNotices } from '@/mock/noticesKeywords';
import Link from 'next/link';
import SettingsIcon from '@mui/icons-material/Settings';
import { Settings } from '@mui/icons-material';

export default function KeywordTab() {
  const [notices, setNotices] = useState<Notice[]>([]);
  useState(true);

  useEffect(() => {
    setNotices(mockKeywordNotices);
  }, []);

  if (notices.length === 0) {
    return (
      <div style={{ padding: '1rem', textAlign: 'center' }}>
        키워드 알림에 해당하는 공지가 없습니다.
      </div>
    );
  }

  return (
    <div>
      <Link
        href="./keywordSettings"
        style={{
          display: 'block',
          padding: '0.5rem 1rem',
          background: '#f8f8f8',
          cursor: 'pointer',
        }}
      >
        <Settings />
        알림 받는 키워드 {notices.length}개
      </Link>

      {notices.map((n) => (
        <SharedNoticeItem key={n.id} notice={n} isRead={false} />
      ))}
    </div>
  );
}
