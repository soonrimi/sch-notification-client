'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import Link from 'next/link';
import styles from './Admin.module.css';
import { AdminControllerService, InternalNoticeListResponse } from '@/api';
import useAdminInfo from './useAdminInfo';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';

const DELETE_WINDOW_MS = 5 * 60 * 1000;
const CATEGORY_COLOR: Record<string, string> = {
  전체: '#1d9ad6',
  학교: '#e74c3c',
  대학: '#27ae60',
  학년: '#9b59b6',
  채용: '#f39c12',
  활동: '#16a085',
  홍보: '#34495e',
};

export default function AdminPage() {
  const { adminToken } = useAdminInfo();
  const [tick, setTick] = useState(0);
  const { push } = useRouter();
  const [notices, setNotices] = useState<InternalNoticeListResponse[]>([]);

  useEffect(() => {
    if (!adminToken) {
      push('/admin/login');
      return;
    }

    AdminControllerService.getMyNotices(adminToken).then((data) => {
      setNotices(data);
    });
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTick((v) => v + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const view = useMemo(
    () => notices.slice().sort((a, b) => dayjs(b.createdAt).diff(a.createdAt)),
    [notices]
  );

  const handleDelete = (
    id: number | undefined,
    createdAt: string | undefined
  ) => {
    if (dayjs(createdAt).diff(dayjs(), 'minute') <= DELETE_WINDOW_MS) {
      alert('작성 후 5분이 지나 삭제할 수 없습니다.');
      return;
    }
    //Todo: delete 구현
  };

  const canDelete = false;
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
            const files = n.attachments?.length || 0;
            const color = CATEGORY_COLOR[n.targetDept?.name || ''] || '#1d9ad6';
            return (
              <article key={n.id} className={styles.card}>
                <div className={styles.cardRowTop}>
                  <span
                    className={styles.catDot}
                    style={{ backgroundColor: color }}
                    aria-hidden
                  />
                  <span className={styles.catText}>{n.targetDept?.name}</span>
                  <span className={styles.metaRight}>
                    {dayjs(n.createdAt).format('YYYY-MM-DD HH:mm')}
                  </span>
                </div>

                <div className={styles.cardMain}>
                  <h2 className={`${styles.cardTitle} ${styles.clamp2}`}>
                    {n.title}
                  </h2>
                  <h2 className={`${styles.cardDetail} ${styles.clamp2}`}>
                    {n.content}
                  </h2>
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
                      삭제 ({dayjs(n.createdAt).format('mm:ss')})
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

      <Link href="/admin/write" className={styles.fab} aria-label="공지 작성">
        +
      </Link>
    </div>
  );
}
