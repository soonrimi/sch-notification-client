// 'use client';
// import React, { useEffect, useState } from 'react';
// import styles from '../page.module.css';
// import Layout from '../../Components/LayoutDir/Layout';
// import type { Notice } from '@/types/notice';
// import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
// import NoticeItem from '@/Components/Notice/NoticeItem';
// import { CrawlPostControllerService } from '@/api/services/CrawlPostControllerService';
// import { mapCrawlPostToNotice } from '@/utils/Noticemappers';

// export default function Bookmark() {
//   const [readIds, setReadIds] = useState<number[]>([]);
//   const [BookmarkDeleteMode, setBookmarkDeleteMode] = useState(false);
//   const [selectedIds, setSelectedIds] = useState<number[]>([]);
//   const [bookmarkedNotices, setBookmarkedNotices] = useState<Notice[]>([]);
//   const [loading, setLoading] = useState(true);

//   // 읽은 공지들 불러오기
//   useEffect(() => {
//     const savedReads = localStorage.getItem('readNotices');
//     if (savedReads) setReadIds(JSON.parse(savedReads).map(Number));
//   }, []);

//   useEffect(() => {
//     const fetchBookmarkedNotices = async () => {
//       setLoading(true);
//       const savedBookmarks = JSON.parse(
//         localStorage.getItem('bookmarkedIds') || '[]'
//       ) as number[];

//       if (savedBookmarks.length === 0) {
//         setBookmarkedNotices([]);
//         setLoading(false);
//         return;
//       }

//       try {
//         const res = await CrawlPostControllerService.getNoticesByIds(
//           savedBookmarks,
//           { page: 0 } // 필요 시 size, sort 추가 가능
//         );
//         setBookmarkedNotices(res.content?.map(mapCrawlPostToNotice) || []);
//       } catch (err) {
//         console.error('Failed to fetch bookmarked notices:', err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchBookmarkedNotices();
//   }, []);

//   // 북마크 토글로 선택했을 때, 해당 북마크id가 북마크id에 이미 없으면 북마크id에 새로 추가
//   const toggleSelect = (id: number) => {
//     setSelectedIds((prev) =>
//       prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
//     );
//   };

//   // 전체 선택/해제
//   const toggleSelectAll = () => {
//     if (selectedIds.length === bookmarkedNotices.length) {
//       setSelectedIds([]);
//     } else {
//       setSelectedIds(bookmarkedNotices.map((n) => n.id));
//     }
//   };

//   // 선택된 북마크 삭제
//   const deleteSelected = () => {
//     const savedBookmarks = JSON.parse(
//       localStorage.getItem('bookmarkedIds') || '[]'
//     ) as number[];
//     const updated = savedBookmarks.filter(
//       (id: number) => !selectedIds.includes(id)
//     );
//     localStorage.setItem('bookmarkedIds', JSON.stringify(updated));
//     setBookmarkedNotices((prev) =>
//       prev.filter((n) => !selectedIds.includes(n.id))
//     );
//     setSelectedIds([]);
//     setBookmarkDeleteMode(false);
//   };

//   const deleteColor = selectedIds.length > 0 ? '#333333' : '#A1A1A1';

//   return (
//     <Layout
//       headerProps={{
//         pageType: 'bookmark',
//         bookmarkProps: {
//           BookmarkDeleteMode,
//           selectedCount: selectedIds.length,
//           totalCount: bookmarkedNotices.length,
//           onSelectAll: toggleSelectAll,
//           onCancelSelection: () => setBookmarkDeleteMode(false),
//           onToggleBookmarkDeleteMode: () => {
//             if (!BookmarkDeleteMode && selectedIds.length === 0)
//               setSelectedIds([]);
//             setBookmarkDeleteMode(!BookmarkDeleteMode);
//           },
//         },
//       }}
//       hideBottomNav={BookmarkDeleteMode}
//       footerSlot={
//         BookmarkDeleteMode && (
//           <div
//             style={{
//               height: '48px',
//               display: 'flex',
//               flexDirection: 'column',
//               justifyContent: 'center',
//               alignItems: 'center',
//               cursor: selectedIds.length > 0 ? 'pointer' : 'default',
//             }}
//             onClick={selectedIds.length > 0 ? deleteSelected : undefined}
//           >
//             <DeleteOutlineIcon
//               sx={{
//                 fontSize: 28,
//                 color: deleteColor,
//               }}
//             />
//             <span
//               style={{
//                 fontSize: 10,
//                 marginTop: -2,
//                 color: deleteColor,
//               }}
//             >
//               삭제
//             </span>
//           </div>
//         )
//       }
//     >
//       <div className={styles.page_wrapper}>
//         <div className={styles.page_content}>
//           {loading ? (
//             <div>로딩중...</div>
//           ) : bookmarkedNotices.length === 0 ? (
//             <div>북마크된 공지가 없습니다</div>
//           ) : (
//             bookmarkedNotices.map((notice: Notice) => (
//               <NoticeItem
//                 key={notice.id}
//                 notice={notice}
//                 isRead={readIds.includes(notice.id)}
//                 BookmarkDeleteMode={BookmarkDeleteMode}
//                 isSelectedForBookmarkDelete={selectedIds.includes(notice.id)}
//                 onSelectToggle={toggleSelect}
//               />
//             ))
//           )}
//         </div>
//       </div>
//     </Layout>
//   );
// }
'use client';

import React, { useState, useEffect, useContext } from 'react';
import styles from '../page.module.css';
import Layout from '../../Components/LayoutDir/Layout';
import type { Notice } from '@/types/notice';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import NoticeItem from '@/Components/Notice/NoticeItem';
import { CrawlPostControllerService } from '@/api/services/CrawlPostControllerService';
import { mapCrawlPostToNotice } from '@/utils/Noticemappers';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CircularProgress } from '@mui/material';
import { BookmarkNoticesContext } from '@/contexts/BookmarkNoticesContext';
import type { PageListResponse } from '@/api/models/PageListResponse';
import type { Pageable } from '@/api/models/Pageable';

export default function Bookmark() {
  const [BookmarkDeleteMode, setBookmarkDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [bookmarkedNotices, setBookmarkedNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // 캐시 컨텍스트
  const { cache, setCache, clearCache } = useContext(BookmarkNoticesContext)!;

  // 로컬스토리지의 북마크 ID
  const [bookmarkIds, setBookmarkIds] = useState<number[]>([]);

  useEffect(() => {
    const savedBookmarks = JSON.parse(
      localStorage.getItem('bookmarkedIds') || '[]'
    ) as number[];
    setBookmarkIds(savedBookmarks);
  }, []);

  // 공지 불러오기
  const fetchBookmarkedNotices = async (
    pageNumber: number,
    ignoreCache = false
  ) => {
    if (bookmarkIds.length === 0) {
      setBookmarkedNotices([]);
      setHasMore(false);
      setLoading(false);
      return;
    }

    // 캐시 확인 (첫 페이지일 때만)
    if (pageNumber === 0 && !ignoreCache && cache.length > 0) {
      setBookmarkedNotices(cache);
      setHasMore(true);
      setPage(0);
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
      const res: PageListResponse =
        await CrawlPostControllerService.searchNoticesByIds(pageable, {
          ids: bookmarkIds,
          keyword: '',
        });

      const newNotices =
        res.content?.map((raw) => mapCrawlPostToNotice(raw)) || [];

      if (pageNumber === 0) {
        setBookmarkedNotices(newNotices);
        setCache(newNotices); // 캐시에 저장
      } else {
        setBookmarkedNotices((prev) => [...prev, ...newNotices]);
        setCache([...(cache || []), ...newNotices]); // 캐시에 이어붙임
      }

      setHasMore(pageNumber + 1 < (res.totalPages ?? 1));
      setPage(pageNumber);
    } catch (err) {
      console.error('Failed to fetch bookmarked notices:', err);
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
    }
  }, [bookmarkIds]);

  const loadMore = () => {
    if (hasMore && !loading) {
      fetchBookmarkedNotices(page + 1);
    }
  };

  const refresh = async () => {
    if (loading) return;
    await fetchBookmarkedNotices(0, true); // 캐시 무시
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
          {loading ? (
            <div>로딩중...</div>
          ) : bookmarkedNotices.length === 0 ? (
            <div>북마크된 공지가 없습니다</div>
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
              pullDownToRefreshContent={
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 60,
                  }}
                >
                  <CircularProgress
                    variant="indeterminate"
                    size={24}
                    style={{ color: '#999' }}
                  />
                </div>
              }
              releaseToRefreshContent={
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 60,
                  }}
                >
                  <CircularProgress
                    variant="indeterminate"
                    color="primary"
                    size={24}
                    style={{ color: '#999' }}
                  />
                </div>
              }
            >
              {bookmarkedNotices.map((notice: Notice) => (
                <NoticeItem
                  key={notice.id}
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
    </Layout>
  );
}
