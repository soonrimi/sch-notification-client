'use client';
import React, { useEffect, useState } from 'react';
import styles from '../page.module.css';
import Layout from '../../Components/LayoutDir/Layout';
import type { Notice } from '@/types/notice';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SharedNoticeItem from '@/Components/Head/SharedNoticeItem';
import { CrawlPostControllerService } from '@/api/services/CrawlPostControllerService';
import { mapCrawlPostToNotice } from '@/utils/Noticemappers';

export default function Bookmark() {
  const [readIds, setReadIds] = useState<number[]>([]);
  const [BookmarkDeleteMode, setBookmarkDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [bookmarkedNotices, setBookmarkedNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  // 읽은 공지들 불러오기
  useEffect(() => {
    const savedReads = localStorage.getItem('readNotices');
    if (savedReads) setReadIds(JSON.parse(savedReads).map(Number));
  }, []);

  useEffect(() => {
    const fetchBookmarkedNotices = async () => {
      setLoading(true);
      const savedBookmarks = JSON.parse(
        localStorage.getItem('bookmarkedIds') || '[]'
      ) as number[];

      if (savedBookmarks.length === 0) {
        setBookmarkedNotices([]);
        setLoading(false);
        return;
      }

      try {
        const res = await CrawlPostControllerService.getNoticesByIds(
          savedBookmarks,
          { page: 0 } // 필요 시 size, sort 추가 가능
        );
        setBookmarkedNotices(res.content?.map(mapCrawlPostToNotice) || []);
      } catch (err) {
        console.error('Failed to fetch bookmarked notices:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookmarkedNotices();
  }, []);

  // 북마크 토글로 선택했을 때, 해당 북마크id가 북마크id에 이미 없으면 북마크id에 새로 추가
  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
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
    ) as number[];
    const updated = savedBookmarks.filter(
      (id: number) => !selectedIds.includes(id)
    );
    localStorage.setItem('bookmarkedIds', JSON.stringify(updated));
    setBookmarkedNotices((prev) =>
      prev.filter((n) => !selectedIds.includes(n.id))
    );
    setSelectedIds([]);
    setBookmarkDeleteMode(false);
  };

  const deleteColor = selectedIds.length > 0 ? '#333333' : '#A1A1A1';

  return (
    <Layout
      headerProps={{
        pageType: 'bookmark',
        bookmarkProps: {
          BookmarkDeleteMode,
          selectedCount: selectedIds.length,
          totalCount: bookmarkedNotices.length,
          onSelectAll: toggleSelectAll,
          onCancelSelection: () => setBookmarkDeleteMode(false),
          onToggleBookmarkDeleteMode: () => {
            if (!BookmarkDeleteMode && selectedIds.length === 0)
              setSelectedIds([]);
            setBookmarkDeleteMode(!BookmarkDeleteMode);
          },
        },
      }}
      hideBottomNav={BookmarkDeleteMode}
      footerSlot={
        BookmarkDeleteMode && (
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
      <div className={styles.page_wrapper}>
        <div className={styles.page_content}>
          {loading ? (
            <div>로딩중...</div>
          ) : bookmarkedNotices.length === 0 ? (
            <div>북마크된 공지가 없습니다</div>
          ) : (
            bookmarkedNotices.map((notice: Notice) => (
              <SharedNoticeItem
                key={notice.id}
                notice={notice}
                isRead={readIds.includes(notice.id)}
                BookmarkDeleteMode={BookmarkDeleteMode}
                isSelectedForBookmarkDelete={selectedIds.includes(notice.id)}
                onSelectToggle={toggleSelect}
              />
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
