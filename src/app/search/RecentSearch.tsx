'use client';
import React from 'react';
import styles from './Search.module.css';
import ClearIcon from '@mui/icons-material/Clear';

interface RecentSearchProps {
  recentKeywords: string[];
  onSelect: (keyword: string) => void;
  onDelete: (keyword: string) => void;
  onDeleteAll: () => void;
}

export default function RecentSearch({
  recentKeywords,
  onSelect,
  onDelete,
  onDeleteAll,
}: RecentSearchProps) {
  if (recentKeywords.length === 0) return <div>최근 검색어가 없습니다.</div>;

  return (
    <div className={styles.recent_wrapper}>
      <div className={styles.header}>
        <span>최근 검색어</span>
        <button className={styles.delete_all} onClick={onDeleteAll}>
          전체 삭제
        </button>
      </div>

      <ul className={styles.keyword_container}>
        {recentKeywords.map((keyword) => (
          <li key={keyword} className={styles.keyword_list}>
            <div className={styles.chip} onClick={() => onSelect(keyword)}>
              <span>{keyword}</span>
              <ClearIcon
                className={styles.delete_icon}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(keyword);
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
