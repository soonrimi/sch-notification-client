'use client';

import React, { useState } from 'react';
import styles from './Bookmark.module.css';
import Layout from '@/Components/LayoutDir/Layout';
import type { Notice } from '@/types/notice';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import NoticeItem from '@/Components/Notice/NoticeItem';
import InfiniteScroll from 'react-infinite-scroll-component';
import ScrollToTop from '@/Components/ScrollToTop/ScrollToTop';
import RefreshLoader from '@/Components/RefreshLoader/RefreshLoader';
import { useBookmarks } from './hooks/useBookmarks';

export default function Bookmark() {
  const [BookmarkDeleteMode, setBookmarkDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const {
    bookmarkedNotices,
    loading,
    hasMore,
    loadMore,
    refresh,
    bookmarkIds,
    updateBookmarkIds,
    setBookmarkedNotices,
  } = useBookmarks();

  // 북마크 선택 관련
  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === bookmarkedNotices.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(bookmarkedNotices.map((n) => n.id));
    }
  };

  const deleteSelected = () => {
    const updated = bookmarkIds.filter((id) => !selectedIds.includes(id));
    updateBookmarkIds(updated);
    setBookmarkedNotices((prev) =>
      prev.filter((n) => !selectedIds.includes(n.id))
    );
    setSelectedIds([]);
    setBookmarkDeleteMode(false);
  };

  const hasSelected = selectedIds.length > 0;

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
            className={`${styles.delete_footer} ${
              !hasSelected ? styles.delete_footer_disabled : ''
            }`}
            onClick={hasSelected ? deleteSelected : undefined}
          >
            <DeleteOutlineIcon
              className={
                hasSelected ? styles.delete_icon : styles.delete_icon_disabled
              }
              sx={{ fontSize: 28 }}
            />
            <span
              className={
                hasSelected ? styles.delete_text : styles.delete_text_disabled
              }
            >
              삭제
            </span>
          </div>
        )
      }
    >
      <div id="bookmark_content" className={styles.content}>
        {loading && bookmarkedNotices.length === 0 ? (
          <div className={styles.loading}>로딩중...</div>
        ) : bookmarkedNotices.length === 0 ? (
          <div className={styles.no_notice}>북마크된 공지가 없습니다</div>
        ) : (
          <InfiniteScroll
            dataLength={bookmarkedNotices.length}
            next={loadMore}
            hasMore={hasMore}
            scrollThreshold="120px"
            loader={<div className={styles.loading}>로딩중...</div>}
            scrollableTarget="bookmark_content"
            pullDownToRefresh={true}
            pullDownToRefreshThreshold={60}
            refreshFunction={refresh}
            pullDownToRefreshContent={<RefreshLoader />}
            releaseToRefreshContent={<RefreshLoader primary />}
          >
            {bookmarkedNotices.map((notice: Notice, index) => (
              <NoticeItem
                key={`${notice.id}-${index}`}
                notice={notice}
                isRead={false}
                BookmarkDeleteMode={BookmarkDeleteMode}
                isSelectedForBookmarkDelete={selectedIds.includes(notice.id)}
                onSelectToggle={toggleSelect}
              />
            ))}
          </InfiniteScroll>
        )}
      </div>

      {/* 스크롤 최상단 이동 버튼 */}
      <ScrollToTop scrollableTargetId="bookmark_content" />
    </Layout>
  );
}
