'use client';
import { useCategories } from '@/contexts/CategoryContext';
import type { Notice } from '@/types/notice';
import NoticeItem from '@/Components/Notice/NoticeItem';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SettingsIcon from '@mui/icons-material/Settings';
import styles from './styles.module.css';

import { CrawlPostControllerService } from '@/api';
import { mapCrawlPostToNotice } from '@/utils/Noticemappers';
import type { Pageable } from '@/api/models/Pageable';
import { BackendCategory, CATEGORY_LABELS } from '@/constants/categories';

export default function AlertTab() {
  const { items } = useCategories();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [includeCount, setIncludeCount] = useState(0);

  const activeCategories = items
    .filter((category) => category.notify)
    .map((category) => category.name);

  useEffect(() => {
    async function fetchAlertNotices() {
      try {
        let results: Notice[] = [];

        for (const cat of activeCategories) {
          const pageable: Pageable = { page: 0, size: 10 };
          const data = await CrawlPostControllerService.getNotices(
            pageable,
            mapToApiCategory(cat)
          );

          const converted =
            data.content?.map((raw) => ({
              ...mapCrawlPostToNotice(raw),
              upload_time: raw.createdAt
                ? new Date(raw.createdAt)
                : new Date(0),
            })) || [];

          results = [...results, ...converted];
        }

        // 최신순 정렬
        results.sort(
          (a, b) => b.upload_time.getTime() - a.upload_time.getTime()
        );

        setNotices(results);
        setIncludeCount(activeCategories.length);
      } catch (err) {
        console.error('알림 공지 불러오기 실패:', err);
      }
    }

    if (activeCategories.length > 0) {
      fetchAlertNotices();
    } else {
      setNotices([]);
      setIncludeCount(0);
    }
  }, [activeCategories]);

  return (
    <div>
      <div className={styles.keywordNum}>
        <NotificationsActiveIcon sx={{ mr: 1, color: '#212121' }} />
        알림 받는 카테고리 {includeCount}개
        <Link href="../category-settings" style={{ marginLeft: 'auto' }}>
          <SettingsIcon sx={{ color: '#B7B7B7' }} />
        </Link>
      </div>
      {notices.map((notice) => (
        <NoticeItem key={notice.id} notice={notice} isRead={false} />
      ))}
    </div>
  );
}

function mapToApiCategory(frontCategory: string): BackendCategory {
  const entry = Object.entries(CATEGORY_LABELS).find(
    ([, label]) => label === frontCategory
  );
  if (!entry) throw new Error(`Unknown category: ${frontCategory}`);
  return entry[0] as BackendCategory;
}
