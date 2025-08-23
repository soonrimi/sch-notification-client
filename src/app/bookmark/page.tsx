'use client';
import React, { useEffect, useState } from 'react';
import styles from '../page.module.css';
import HomeNotice from '../home/HomeNotice';
import Layout from '../../Components/LayoutDir/Layout';
import { Category } from '@/types/notice';
import type { Notice } from '@/types/notice';
import { getNoticesByCategory } from '@/mock/notices';
import { useBookmark } from '@/hooks/useBookmark';
import { useRouter } from 'next/navigation';

export default function Bookmark() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [readIds, setReadIds] = useState<string[]>([]);
  const router = useRouter();

  // 전체 공지 불러오기
  useEffect(() => {
    const data = getNoticesByCategory('전체' as Category);
    setNotices(data);

    // 읽은 공지 로컬스토리지에서 가져오기
    const savedReads = localStorage.getItem('readNotices');
    if (savedReads) setReadIds(JSON.parse(savedReads));
  }, []);

  const bookmarkedNotices = notices.filter((n) => {
    const savedBookmarks = JSON.parse(
      localStorage.getItem('bookmarkedIds') || '[]'
    );
    return savedBookmarks.includes(n.id);
  });

  return (
    <Layout pageType="bookmark">
      <div className={styles.page_content}>
        {bookmarkedNotices.length === 0 ? (
          <div>북마크된 공지가 없습니다.</div>
        ) : (
          bookmarkedNotices.map((notice) => (
            <BookmarkNoticeWrapper
              key={notice.id}
              notice={notice}
              isRead={readIds.includes(notice.id)}
              router={router}
            />
          ))
        )}
      </div>
    </Layout>
  );
}

// 훅 적용된 개별 공지 컴포넌트 + 상세페이지 이동
function BookmarkNoticeWrapper({
  notice,
  isRead,
  router,
}: {
  notice: Notice;
  isRead: boolean;
  router: ReturnType<typeof useRouter>;
}) {
  const { bookmarked, toggleBookmark } = useBookmark(notice.id);

  const handleClick = () => {
    const url = `/home?id=${encodeURIComponent(notice.id)}`;
    console.log('북마크 클릭 URL:', url);
    router.push(url); // 쿼리 파라미터 기반 상세페이지 이동
  };

  return (
    <div style={{ cursor: 'pointer', marginBottom: 8 }} onClick={handleClick}>
      <HomeNotice
        id={notice.id}
        category={notice.category}
        upload_time={notice.upload_time}
        application_period={notice.application_period}
        title={notice.title}
        detail={notice.detail}
        isBookmarked={bookmarked}
        onToggleBookmark={toggleBookmark}
        isRead={isRead}
      />
    </div>
  );
}
