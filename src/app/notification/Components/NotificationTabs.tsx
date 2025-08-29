'use client';
import styles from './styles.module.css';
import { useState } from 'react';

type TabKey = 'category' | 'keyword';

export default function NotificationTabs({
  value,
  onChange,
}: {
  value?: TabKey;
  onChange?: (v: TabKey) => void;
}) {
  const [internal, setInternal] = useState<TabKey>(value ?? 'category');
  const current = value ?? internal;

  const change = (v: TabKey) => {
    if (onChange) onChange(v);
    else setInternal(v);
  };

  return (
    <div className={styles.groupBtn}>
      <button
        className={`${styles.tabBtn} ${current === 'category' ? styles.active : ''}`}
        onClick={() => change('category')}
      >
        카테고리
      </button>
      <button
        className={`${styles.tabBtn} ${current === 'keyword' ? styles.active : ''}`}
        onClick={() => change('keyword')}
      >
        키워드
      </button>
    </div>
  );
}
