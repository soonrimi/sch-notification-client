'use client';

import React, { useState, useEffect } from 'react';
import styles from '../page.module.css';
import Layout from '@/Components/LayoutDir/Layout';
import type { Notice } from '@/types/notice';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import NoticeItem from '@/Components/Notice/NoticeItem';
import { CrawlPostControllerService } from '@/api/services/CrawlPostControllerService';
import { mapCrawlPostToNotice } from '@/utils/Noticemappers';
import InfiniteScroll from 'react-infinite-scroll-component';
import type { PageListResponse } from '@/api/models/PageListResponse';
import type { Pageable } from '@/api/models/Pageable';
import type { SearchRequestDto } from '@/api/models/SearchRequestDto';
import ScrollToTop from '@/Components/ScrollToTop/ScrollToTop';
import RefreshLoader from '@/Components/RefreshLoader/RefreshLoader';

export default function Bookmark() {
  const [BookmarkDeleteMode, setBookmarkDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [bookmarkedNotices, setBookmarkedNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [bookmarkIds, setBookmarkIds] = useState<number[]>([]);

  // 로컬스토리지에서 북마크 ID 가져오기
  useEffect(() => {
    const savedBookmarks = JSON.parse(
      localStorage.getItem('bookmarkedIds') || '[]'
    ) as number[];
    setBookmarkIds(savedBookmarks);
  }, []);

  // 북마크 공지 불러오기
  const fetchBookmarkedNotices = async (pageNumber: number) => {
    if (bookmarkIds.length === 0) {
      setBookmarkedNotices([]);
      setHasMore(false);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const pageable: Pageable = {
        page: pageNumber,
        size: 20,
        sort: ['createdAt,DESC'],
      };
      const requestBody: SearchRequestDto = { ids: bookmarkIds };

      const data: PageListResponse =
        await CrawlPostControllerService.searchNoticesByIds(
          pageable,
          requestBody
        );

      const convertedNotices: Notice[] =
        data.content?.map((raw) => {
          const notice = mapCrawlPostToNotice(raw);
          return {
            ...notice,
            upload_time: raw.createdAt ? new Date(raw.createdAt) : new Date(0),
          };
        }) || [];

      if (pageNumber === 0) {
        setBookmarkedNotices(convertedNotices);
      } else {
        setBookmarkedNotices((prev) => [...prev, ...convertedNotices]);
      }

      setHasMore(pageNumber + 1 < (data.totalPages ?? 1));
      setPage(pageNumber);
    } catch (err) {
      console.warn('API 실패:', err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bookmarkIds.length > 0) {
      fetchBookmarkedNotices(0);
    } else {
      setLoading(false);
      setBookmarkedNotices([]);
    }
  }, [bookmarkIds]);

  const loadMore = () => {
    if (hasMore && !loading) {
      fetchBookmarkedNotices(page + 1);
    }
  };

  // 당겨서 새로고침 시에만 강제 API 호출
  const refresh = async () => {
    if (loading) return;
    await fetchBookmarkedNotices(0);
  };

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
    localStorage.setItem('bookmarkedIds', JSON.stringify(updated));
    setBookmarkIds(updated);
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
        <div id="bookmark_content" className={styles.page_content}>
          {loading && bookmarkedNotices.length === 0 ? (
            <div className={styles.loading}>로딩중...</div>
          ) : bookmarkedNotices.length === 0 ? (
            <div className={styles.no_notice}>북마크된 공지가 없습니다</div>
          ) : (
            <InfiniteScroll
              dataLength={bookmarkedNotices.length}
              next={loadMore}
              hasMore={hasMore}
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
      </div>

      {/* 스크롤 최상단 이동 버튼 */}
      <ScrollToTop scrollableTargetId="bookmark_content" />
    </Layout>
  );
}
