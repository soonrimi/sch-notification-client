'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import styles from './Admin.module.css';
import {
  loadNotices,
  deleteNotice as lsDelete,
  seedIfEmpty,
  type LocalNotice,
  type Category,
} from './localNotice';
import useAdminInfo from './useAdminInfo';
import { useRouter } from 'next/navigation';

const CATEGORY_COLOR: Record<Category, string> = {
  전체: '#1d9ad6',
  학교: '#e74c3c',
  대학: '#27ae60',
  학년: '#9b59b6',
  채용: '#f39c12',
  활동: '#16a085',
  홍보: '#34495e',
};

const DELETE_WINDOW_MS = 5 * 60 * 1000;

const msLeft = (createdAt: string) =>
  Math.max(0, DELETE_WINDOW_MS - (Date.now() - new Date(createdAt).getTime()));

const fmtMMSS = (ms: number) => {
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

export default function AdminHomePage() {
  const [, setTick] = useState(0); // 카운트다운 재렌더용
  const [notices, setNotices] = useState<LocalNotice[]>([]);
  const { adminToken } = useAdminInfo();
  const { push } = useRouter();

  useEffect(() => {
    if (!adminToken) {
      push('/admin/login');
      return;
    }

    let mounted = true;
    seedIfEmpty();
    const refresh = () => mounted && setNotices(loadNotices());
    refresh();

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'soonrimi_admin_notices') refresh();
    };
    window.addEventListener('storage', onStorage);

    const t = setInterval(() => setTick((v) => v + 1), 1000);

    return () => {
      mounted = false;
      window.removeEventListener('storage', onStorage);
      clearInterval(t);
    };
  }, []);

  const view = useMemo(
    () =>
      notices
        .slice()
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ),
    [notices]
  );

  const handleDelete = (id: string, createdAt: string) => {
    if (msLeft(createdAt) <= 0) {
      alert('작성 후 5분이 지나 삭제할 수 없습니다.');
      return;
    }
    lsDelete(id);
    setNotices((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className={styles.adminRoot}>
      <div className={styles.headerBar}>
        <h1 className={styles.title}>등록된 공지</h1>
      </div>

      <div className={styles.listWrap}>
        {view.length === 0 ? (
          <div className={styles.empty}>등록된 공지가 없습니다.</div>
        ) : (
          view.map((n) => {
            const left = msLeft(n.createdAt);
            const canDelete = left > 0;
            const color = CATEGORY_COLOR[n.category] || '#1d9ad6';
            const created = new Date(n.createdAt).toLocaleString(undefined, {
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            });
            const files = n.attachments?.length || 0;

            return (
              <article key={n.id} className={styles.card}>
                <div className={styles.cardRowTop}>
                  <span
                    className={styles.catDot}
                    style={{ backgroundColor: color }}
                    aria-hidden
                  />
                  <span className={styles.catText}>{n.category}</span>
                  <span className={styles.metaRight}>{created}</span>
                </div>

                <div className={styles.cardMain}>
                  <h2 className={styles.cardTitle}>{n.title}</h2>
                  <p className={styles.cardDetail}>{n.content}</p>
                </div>

                <div className={styles.metaRow}>
                  <span className={styles.metaLeft}>
                    관리자{files > 0 ? ` · 첨부 ${files}` : ''}
                  </span>

                  {canDelete ? (
                    <button
                      className={styles.btnDelete}
                      onClick={() => handleDelete(n.id, n.createdAt)}
                      title="작성 후 5분 이내에만 삭제 가능"
                    >
                      삭제 ({fmtMMSS(left)})
                    </button>
                  ) : (
                    <span className={styles.deleteDisabled}>삭제 불가</span>
                  )}
                </div>
              </article>
            );
          })
        )}
      </div>

      <Link href="/admin/write" className={styles.fab} aria-label="글쓰기">
        +
      </Link>
    </div>
  );
}
