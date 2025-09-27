'use client';
import { useCategories } from '@/contexts/CategoryContext';
import { useNotices } from '@/hooks/useNotices';
import SharedNoticeItem from '@/Components/Head/SharedNoticeItem';
import { useEffect, useState } from 'react';
import { Category, ApiCategory } from '@/constants/categories';

export default function AlertTab() {
  const { items } = useCategories();

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

  if (alertNotices.length === 0) {
    return (
      <div style={{ padding: '1rem', textAlign: 'center' }}>
        알림 설정한 카테고리 공지가 없습니다.
      </div>
    );
  }

  return (
    <div>
      {alertNotices.map((notice) => (
        <SharedNoticeItem key={notice.id} notice={notice} isRead={false} />
      ))}
    </div>
  );
}
