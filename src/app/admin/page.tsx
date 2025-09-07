'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import Link from 'next/link';
import styles from './Admin.module.css';
import {
  loadLocalNotices,
  deleteLocalNotice,
  remainSeconds,
  formatMMSS,
  type LocalNotice,
} from './localNotice';

const CAT_COLOR: Record<string, string> = {
  학교: '#2563eb',
  대학: '#7c3aed',
  학과: '#14b8a6',
  학년: '#6366f1',
  채용: '#059669',
  활동: '#ef4444',
  홍보: '#f59e0b',
};

export default function AdminPage() {
  const [items, setItems] = useState<LocalNotice[]>([]);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setItems(loadLocalNotices());
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTick((v) => v + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const list = useMemo(
    () =>
      items.map((n) => ({
        ...n,
        _remain: remainSeconds(n.createdAt),
      })),
    [items, tick]
  );

  const onDelete = useCallback((id: string) => {
    deleteLocalNotice(id);
    setItems((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <div className={styles.adminRoot}>
      <div className={styles.headerBar}>
        <h1 className={styles.title}>등록된 공지</h1>
      </div>

      <div className={styles.listWrap}>
        {list.length === 0 ? (
          <div className={styles.empty}>등록된 공지가 없습니다.</div>
        ) : (
          <div>
            {list.map((n) => (
              <div key={n.id} className={styles.card}>
                <div className={styles.cardRowTop}>
                  <span
                    className={styles.catDot}
                    style={{
                      backgroundColor: CAT_COLOR[n.category] ?? '#94a3b8',
                    }}
                  />
                  <span className={styles.catText}>{n.category}</span>
                  <span className={styles.metaRight}>
                    <time dateTime={n.createdAt}>
                      {new Date(n.createdAt).toLocaleString()}
                    </time>
                  </span>
                </div>

                {/* 여기만 변경: /admin/detail?id=... */}
                <Link
                  href={`/admin/detail?id=${n.id}`}
                  className={styles.cardMainLink}
                >
                  <div className={styles.cardMain}>
                    <h3 className={`${styles.cardTitle} ${styles.clamp2}`}>
                      {n.title}
                    </h3>
                    <p className={`${styles.cardDetail} ${styles.clamp2}`}>
                      {n.content}
                    </p>
                  </div>
                </Link>

                <div className={styles.metaRow}>
                  <div className={styles.metaLeft}>
                    {n.category === '학년' && n.year ? `${n.year} · ` : null}
                    첨부 {n.files?.length ?? 0}개
                  </div>

                  {n._remain > 0 ? (
                    <button
                      className={styles.btnDelete}
                      onClick={() => onDelete(n.id)}
                      title="등록 후 5분 이내에만 삭제 가능"
                    >
                      삭제 {formatMMSS(n._remain)}
                    </button>
                  ) : (
                    <span className={styles.deleteDisabled}>삭제 불가</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Link href="/admin/write" className={styles.fab} aria-label="공지 작성">
        +
      </Link>
    </div>
  );
}
