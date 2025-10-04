'use client';
import { useEffect, useState } from 'react';
import NoticeItem from '@/Components/Notice/NoticeItem';
import type { Notice } from '@/types/notice';
import { mockKeywordNotices } from '@/mock/noticesKeywords';
import Link from 'next/link';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SettingsIcon from '@mui/icons-material/Settings';
import styles from './styles.module.css';

export default function KeywordTab() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [includeCount, setIncludeCount] = useState(0);

  useEffect(() => {
    setNotices(mockKeywordNotices);
    const saved = JSON.parse(localStorage.getItem('keywords') || '{}');
    setIncludeCount(saved.include ? saved.include.length : 0);
  }, []);

  return (
    <div>
      <div className={styles.keywordNum}>
        <NotificationsActiveIcon sx={{ mr: 1, color: '#212121' }} />
        알림 받는 키워드 {includeCount}개
        <Link href="./keywordSettings" style={{ marginLeft: 'auto' }}>
          <SettingsIcon sx={{ color: '#B7B7B7' }} />
        </Link>
      </div>
      {notices.map((n) => (
        <NoticeItem key={n.id} notice={n} isRead={false} />
      ))}
    </div>
  );
}
