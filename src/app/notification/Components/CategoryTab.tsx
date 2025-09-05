'use client';
import { useCategories } from '@/contexts/CategoryContext';
import { useNotices } from '@/hooks/useNotices';
import SharedNoticeItem from '@/Components/Head/SharedNoticeItem';

export default function AlertTab() {
  const { items } = useCategories();
  const activeCategories = items.filter((c) => c.notify).map((c) => c.name);

  const allNotices = useNotices('전체');
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
