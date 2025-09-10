'use client';
import React, { useEffect, useState } from 'react';
import styles from '../page.module.css';
import Layout from '../../Components/LayoutDir/Layout';
import { useCategories, CategoryItem } from '@/contexts/CategoryContext';
import { Category } from '@/types/notice';
import { useNotices } from '@/hooks/useNotices';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SharedNoticeItem from '@/Components/Head/SharedNoticeItem';

export default function Bookmark() {
  // 기본 카테고리 설정
  const { items } = useCategories();
  // category 상태 생성 (items 로드 후 업데이트)
  const [category, setCategory] = useState<Category>({ id: 0, name: '전체' });

  useEffect(() => {
    if (items.length > 0) {
      setCategory({ id: Number(items[0].id), name: items[0].name });
    }
  }, [items]);

  // 선택된 category 기반으로 공지 가져오기
  const notices = useNotices(category);
  const [readIds, setReadIds] = useState<string[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

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
      <div className={styles.page_wrapper}>
        <div className={styles.page_content}>
          {bookmarkedNotices.length === 0 ? (
            <div></div>
          ) : (
            bookmarkedNotices.map((notice) => (
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
