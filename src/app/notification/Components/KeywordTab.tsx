'use client';
import { useEffect, useState } from 'react';
import NoticeItem from '@/Components/Notice/NoticeItem';
import type { Notice } from '@/types/notice';
import Link from 'next/link';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import styles from './styles.module.css';
import { KeywordControllerService, CrawlPostControllerService } from '@/api';
import { mapCrawlPostToNotice } from '@/utils/Noticemappers';

export default function KeywordTab() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [includeCount, setIncludeCount] = useState(0);

  useEffect(() => {
    const fetchKeywordNotices = async () => {
      try {
        const deviceId = localStorage.getItem('device_id');
        if (!deviceId) {
          console.warn('device_id가 없습니다.');
          return;
        }

        // const keywordData = await KeywordControllerService.getByDeviceId(deviceId);
        // const includeKeywords = keywordData.include || [];
        // const excludeKeywords = keywordData.exclude || [];

        //임시 로컬스토리지 사용
        const saved = JSON.parse(localStorage.getItem('keywords') || '{}');
        const includeKeywords = saved.include || [];
        const excludeKeywords = saved.exclude || [];

        setIncludeCount(includeKeywords.length);

        let allNotices: Notice[] = [];

        // for (const keyword of includeKeywords) {
        //   const data = await CrawlPostControllerService.searchNotices({
        //     keyword,
        //     page: 0,
        //     size: 10,
        //   });

        // const converted =
        //   data.content?.map((raw) => ({
        //     ...mapCrawlPostToNotice(raw),
        //     upload_time: raw.createdAt
        //       ? new Date(raw.createdAt)
        //       : new Date(0),
        //   })) || [];

        //   allNotices.push(...converted);
        // }

        //제외 키워드 필터링
        const filtered = allNotices.filter(
          (notice) =>
            !excludeKeywords.some((ex: string) => notice.title.includes(ex))
        );

        //최신순 정렬
        filtered.sort(
          (a, b) => b.upload_time.getTime() - a.upload_time.getTime()
        );

        setNotices(filtered);
      } catch (err) {
        console.error('키워드 공지 불러오기 실패:', err);
      }
    };

    fetchKeywordNotices();
  }, []);

  return (
    <div>
      <div className={styles.keywordNum}>
        <NotificationsIcon sx={{ mr: 1, color: '#50545F' }} />
        알림 받는 키워드 {includeCount}개
        <Link href="./keywordSettings" style={{ marginLeft: 'auto' }}>
          <SettingsIcon sx={{ color: '#50545F' }} />
        </Link>
      </div>
      {notices.map((n) => (
        <NoticeItem key={n.id} notice={n} isRead={false} />
      ))}
    </div>
  );
}
