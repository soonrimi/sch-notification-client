'use client';

import { useEffect } from 'react';
import { HealthCheckService } from '@/api/services/HealthCheckService';

export default function TestPage() {
  useEffect(() => {
    connectServer();
  }, []);

  async function connectServer() {
    try {
      const { data } = await HealthCheckService.health();
      console.log('서버 연결 성공:', data);
      alert('서버 연결 성공!');
    } catch (error) {
      console.error('서버 연결 실패:', error);
      alert('서버 연결 실패. 콘솔을 확인하세요.');
    }
  }

  return (
    <div>
      <h1>서버 연결 테스트</h1>
    </div>
  );
}
