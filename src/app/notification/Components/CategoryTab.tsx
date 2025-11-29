'use client';
import type { Notice } from '@/types/notice';
import NoticeItem from '@/Components/Notice/NoticeItem';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import styles from './styles.module.css';

import { CrawlPostControllerService, SubscribeControllerService } from '@/api';
import { mapCrawlPostToNotice } from '@/utils/Noticemappers';
import { BackendCategory } from '@/constants/categories';
import { STORAGE_KEY_DEVICE_ID } from '@/constants/localStorage';

export default function CategoryTab() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [includeCount, setIncludeCount] = useState(0);

  useEffect(() => {
    const fetchSubscribedCategories = async () => {
      try {
        const deviceId = localStorage.getItem(STORAGE_KEY_DEVICE_ID);
        if (!deviceId) {
          console.warn('deviceId가 없습니다.');
          return;
        }

        const saved = JSON.parse(
          localStorage.getItem('notify_categories') || '{}'
        );
        const localActiveCategories = Object.entries(saved)
          .filter(([_, value]) => value)
          .map(([key]) => key);

        setIncludeCount(localActiveCategories.length);

        const response = await SubscribeControllerService.getByDevice(deviceId);

        const subscribedBackendCats = response
          .filter((item) => item.subscribed)
          .map((item) => item.category)
          .filter((cat): cat is string => !!cat) as BackendCategory[];

        if (subscribedBackendCats.length > 0) {
          setIncludeCount(subscribedBackendCats.length);
        }

        let results: Notice[] = [];

        for (const backendCat of subscribedBackendCats) {
          const data = await CrawlPostControllerService.getNotices(
            backendCat,
            0,
            10
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

        results.sort(
          (a, b) => b.upload_time.getTime() - a.upload_time.getTime()
        );
        setNotices(results);
      } catch (err) {
        console.error('알림 공지 불러오기 실패:', err);
      }
    };

    fetchSubscribedCategories();
  }, []);

  return (
    <div>
      <div className={styles.keywordNum}>
        <NotificationsIcon sx={{ mr: 1, color: '#50545F' }} />
        알림 받는 카테고리 {includeCount}개
        <Link href="./category-notify" style={{ marginLeft: 'auto' }}>
          <SettingsIcon sx={{ color: '#50545F' }} />
        </Link>
      </div>
      {notices.map((notice) => (
        <NoticeItem key={notice.id} notice={notice} isRead={false} />
      ))}
    </div>
  );
}
