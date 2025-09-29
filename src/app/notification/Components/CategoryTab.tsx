'use client';
import { useCategories } from '@/contexts/CategoryContext';
import { useNotices } from '../../home/components/HomeContent/useNotices';
import type { Notice } from '@/types/notice';
import NoticeItem from '@/Components/Notice/NoticeItem';
import { useEffect, useState } from 'react';
import { Category, ApiCategory } from '@/constants/categories';
import Link from 'next/link';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SettingsIcon from '@mui/icons-material/Settings';
import { mockKeywordNotices } from '@/mock/noticesKeywords';
import styles from './styles.module.css';

export default function AlertTab() {
  const { items } = useCategories();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [includeCount, setIncludeCount] = useState(0);

  useEffect(() => {
    setNotices(mockKeywordNotices);
    const saved = JSON.parse(localStorage.getItem('keywords') || '{}');
    setIncludeCount(saved.include ? saved.include.length : 0);
  }, []);

  const [category, setCategory] = useState<Category>('전체');

  useEffect(() => {
    setCategory('전체');
  }, [items]);

  // 전체 공지 가져오기
  const { notices: allNotices } = useNotices(category as ApiCategory);

  // 알림 설정된 카테고리 필터링
  const activeCategories = items
    .filter((category) => category.notify)
    .map((category) => category.name);
  const alertNotices = allNotices.filter((n) =>
    activeCategories.includes(n.category)
  );

  return (
    <div>
      <div className={styles.keywordNum}>
        <NotificationsActiveIcon sx={{ mr: 1, color: '#212121' }} />
        알림 받는 카테고리 {includeCount}개
        <Link href="../category-settings" style={{ marginLeft: 'auto' }}>
          <SettingsIcon sx={{ color: '#B7B7B7' }} />
        </Link>
      </div>
      {alertNotices.map((notice) => (
        <NoticeItem key={notice.id} notice={notice} isRead={false} />
      ))}
    </div>
  );
}
