'use client';
import { useCategories } from '@/contexts/CategoryContext';
import { useNotices } from '@/hooks/useNotices';
import SharedNoticeItem from '@/Components/Head/SharedNoticeItem';
import { useEffect, useState } from 'react';
import { Category } from '@/types/notice';

export default function AlertTab() {
  const { items } = useCategories();

  // Category 객체 상태
  const [category, setCategory] = useState<Category>({ id: 0, name: '전체' });

  useEffect(() => {
    // 전체 카테고리 객체 찾기
    const allCategory = items.find((c) => c.name === '전체');
    if (allCategory) {
      setCategory({ id: Number(allCategory.id), name: allCategory.name });
    }
  }, [items]);

  // 전체 공지 가져오기
  const allNotices = useNotices(category);

  // 알림 설정된 카테고리 필터링
  const activeCategories = items.filter((c) => c.notify).map((c) => c.name);
  const alertNotices = allNotices.filter((n) =>
    activeCategories.includes(n.category.name)
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
