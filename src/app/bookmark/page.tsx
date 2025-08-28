'use client';
import React, { useEffect, useState } from 'react';
import styles from '../page.module.css';
import HomeNotice from '../home/HomeNotice';
import Layout from '../../Components/LayoutDir/Layout';
import { Category, Notice } from '@/types/notice';
import { useNotices } from '@/hooks/useNotices';
import { useBookmark } from '@/hooks/useBookmark';
import { useRouter } from 'next/navigation';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

export default function Bookmark() {
  const notices = useNotices('전체' as Category);
  const [readIds, setReadIds] = useState<string[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const router = useRouter();

  // 읽은 목록 불러오기
  useEffect(() => {
    const savedReads = localStorage.getItem('readNotices');
    if (savedReads) setReadIds(JSON.parse(savedReads));
  }, []);

  // 북마크된 공지 필터링
  const bookmarkedNotices = notices.filter((n) => {
    const savedBookmarks = JSON.parse(
      localStorage.getItem('bookmarkedIds') || '[]'
    );
    return savedBookmarks.includes(n.id);
  });

  // 선택 토글
  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((sid) => sid !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // 전체 선택/해제
  const toggleSelectAll = () => {
    if (selectedIds.length === bookmarkedNotices.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(bookmarkedNotices.map((n) => n.id));
    }
  };

  // 선택된 북마크 삭제
  const deleteSelected = () => {
    const savedBookmarks = JSON.parse(
      localStorage.getItem('bookmarkedIds') || '[]'
    );
    const updated = savedBookmarks.filter(
      (id: string) => !selectedIds.includes(id)
    );
    localStorage.setItem('bookmarkedIds', JSON.stringify(updated));
    setSelectedIds([]);
    setSelectionMode(false);
  };

  const deleteColor = selectedIds.length > 0 ? '#333333' : '#A1A1A1';

  return (
    <Layout
      headerProps={{
        pageType: 'bookmark',
        bookmarkProps: {
          selectionMode,
          selectedCount: selectedIds.length,
          totalCount: bookmarkedNotices.length,
          onSelectAll: toggleSelectAll,
          onCancelSelection: () => setSelectionMode(false),
          onToggleSelectionMode: () => {
            if (!selectionMode && selectedIds.length === 0) setSelectedIds([]);
            setSelectionMode(!selectionMode);
          },
        },
      }}
      hideBottomNav={selectionMode}
      footerSlot={
        selectionMode && (
          <div
            style={{
              height: '48px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: selectedIds.length > 0 ? 'pointer' : 'default',
            }}
            onClick={selectedIds.length > 0 ? deleteSelected : undefined}
          >
            <DeleteOutlineIcon
              sx={{
                fontSize: 28,
                color: deleteColor,
              }}
            />
            <span
              style={{
                fontSize: 10,
                marginTop: -2,
                color: deleteColor,
              }}
            >
              삭제
            </span>
          </div>
        )
      }
    >
      <div className={styles.page_content}>
        {bookmarkedNotices.length === 0 ? (
          <div></div>
        ) : (
          bookmarkedNotices.map((notice) => (
            <BookmarkNoticeWrapper
              key={notice.id}
              notice={notice}
              isRead={readIds.includes(notice.id)}
              router={router}
              selectionMode={selectionMode}
              isSelected={selectedIds.includes(notice.id)}
              toggleSelect={toggleSelect}
            />
          ))
        )}
      </div>
    </Layout>
  );
}

// 개별 공지 Wrapper
function BookmarkNoticeWrapper({
  notice,
  isRead,
  router,
  selectionMode,
  isSelected,
  toggleSelect,
}: {
  notice: Notice;
  isRead: boolean;
  router: ReturnType<typeof useRouter>;
  selectionMode: boolean;
  isSelected: boolean;
  toggleSelect: (id: string) => void;
}) {
  const { bookmarked, toggleBookmark } = useBookmark(notice.id);

  const handleClick = () => {
    if (selectionMode) {
      toggleSelect(notice.id);
    } else {
      router.push(`/home?id=${encodeURIComponent(notice.id)}`);
    }
  };

  return (
    <div style={{ cursor: 'pointer', marginBottom: 0 }} onClick={handleClick}>
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
        selectionMode={selectionMode}
        isSelected={isSelected}
      />
    </div>
  );
}
