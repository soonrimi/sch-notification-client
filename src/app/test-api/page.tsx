'use client';
import { useEffect, useState } from 'react';
import { CrawlPostControllerService } from '@/api/services/CrawlPostControllerService';

export default function TestNotices() {
  const [data, setData] = useState<string>('콘솔에서 API 호출 확인');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const all = await CrawlPostControllerService.getAllNotices();
        console.log('getAllNotices:', all);
      } catch (err) {
        console.error('getAllNotices 에러:', err);
      }
    };
    fetchData();
  }, []);

  return <div>{data}</div>;
}
