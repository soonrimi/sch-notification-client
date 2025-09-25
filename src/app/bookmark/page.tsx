'use client';
import React, { useEffect, useState } from 'react';
import styles from '../page.module.css';
import Layout from '../../Components/LayoutDir/Layout';
import { useCategories } from '@/contexts/CategoryContext';
import { useNotices } from '@/hooks/useNotices';
import type { Notice } from '@/types/notice';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SharedNoticeItem from '@/Components/Head/SharedNoticeItem';
import { Category, ApiCategory } from '@/constants/categories';

export default function Bookmark() {
  const { items } = useCategories();
  const [category, setCategory] = useState<Category>('전체');

  useEffect(() => {
    setCategory('전체');
  }, [items]);

  // 선택된 category 기반으로 공지 가져오기 (loading 포함)
  const { notices, loading } = useNotices(category as ApiCategory);

  const [readIds, setReadIds] = useState<number[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // 읽은 목록 불러오기
  useEffect(() => {
    const savedReads = localStorage.getItem('readNotices');
    if (savedReads) setReadIds(JSON.parse(savedReads).map(Number));
  }, []);

  // 북마크된 공지 필터링
  const bookmarkedNotices = notices.filter((n) => {
    const savedBookmarks = JSON.parse(
      localStorage.getItem('bookmarkedIds') || '[]'
    );
    return savedBookmarks.includes(n.id);
  });

  // 선택 토글
  const toggleSelect = (id: number) => {
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
    ) as number[];
    const updated = savedBookmarks.filter(
      (id: number) => !selectedIds.includes(id)
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
                selectionMode={selectionMode}
                isSelected={selectedIds.includes(notice.id)}
                onSelectToggle={toggleSelect}
              />
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
