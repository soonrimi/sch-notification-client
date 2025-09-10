'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from '../Admin.module.css';
import { InternalNoticeListResponse } from '@/api';
import dayjs from 'dayjs';

/** 실제로 useSearchParams()를 사용하는 컴포넌트 */
function DetailInner() {
  const sp = useSearchParams();
  const id = sp.get('id') ?? '';
  const [item, setItem] = useState<InternalNoticeListResponse | null>(null);

  useEffect(() => {}, [id]);

  return (
    <div className={styles.detailInner}>
      {!item ? (
        <div className={styles.empty}>해당 공지를 찾을 수 없습니다.</div>
      ) : (
        <article className={styles.detailCard}>
          <div className={styles.detailHeaderRow}>
            <span className={styles.catBadge}>
              {item.targetDept?.name}
              {` · ${item.targetYear}`}
            </span>
            <time className={styles.metaTime} dateTime={item.createdAt}>
              {dayjs(item.createdAt).toLocaleString()}
            </time>
          </div>

          <h2 className={styles.detailTitle}>{item.title}</h2>

          <div className={styles.sectionDivider} />

          <div className={styles.detailContent}>{item.content}</div>

          {item.attachments?.length ? (
            <>
              <div className={styles.sectionDivider} />
              <div className={styles.sectionTitleSm}>첨부파일</div>
              <ol className={styles.attachList}>
                {item.attachments?.map((f, i) => (
                  <li key={f.fileUrl}>
                    {i + 1}. {f.fileName}
                  </li>
                ))}
              </ol>
            </>
          ) : null}
        </article>
      )}
    </div>
  );
}

/** 페이지 컴포넌트: useSearchParams()를 사용하는 DetailInner를 Suspense로 감쌉니다. */
export default function AdminDetailPage() {
  const router = useRouter();

  return (
    <div className={styles.detailWrap}>
      <div className={styles.topBar}>
        <button className={styles.topBtn} onClick={() => router.back()}>
          뒤로
        </button>
        <h1 className={styles.topTitle}>공지 상세</h1>
        <span />
      </div>

      <Suspense
        fallback={
          <div className={styles.detailInner}>
            <article className={styles.detailCard}>
              <div className={styles.skeletonCard} style={{ height: 24 }} />
              <div
                className={styles.skeletonCard}
                style={{ height: 20, marginTop: 8 }}
              />
              <div
                className={styles.skeletonCard}
                style={{ height: 140, marginTop: 12 }}
              />
            </article>
          </div>
        }
      >
        <DetailInner />
      </Suspense>
    </div>
  );
}
