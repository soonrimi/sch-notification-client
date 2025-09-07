'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from '../Admin.module.css';
import { loadLocalNotices, type LocalNotice } from '../localNotice';

export default function AdminDetailPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const id = sp.get('id') ?? '';
  const [item, setItem] = useState<LocalNotice | null>(null);

  useEffect(() => {
    const list = loadLocalNotices();
    setItem(list.find((n) => n.id === id) ?? null);
  }, [id]);

  return (
    <div className={styles.detailWrap}>
      {/* 상단바 (목록/작성과 동일 레이아웃) */}
      <div className={styles.topBar}>
        <button className={styles.topBtn} onClick={() => router.back()}>
          뒤로
        </button>
        <h1 className={styles.topTitle}>공지 상세</h1>
        <span />
      </div>

      <div className={styles.detailInner}>
        {!item ? (
          <div className={styles.empty}>해당 공지를 찾을 수 없습니다.</div>
        ) : (
          <article className={styles.detailCard}>
            {/* 카테고리 배지 + 작성시간 */}
            <div className={styles.detailHeaderRow}>
              <span className={styles.catBadge}>
                {item.category}
                {item.category === '학년' && item.year ? ` · ${item.year}` : ''}
              </span>
              <time className={styles.metaTime} dateTime={item.createdAt}>
                {new Date(item.createdAt).toLocaleString()}
              </time>
            </div>

            {/* 제목 */}
            <h2 className={styles.detailTitle}>{item.title}</h2>

            {/* 구분선 */}
            <div className={styles.sectionDivider} />

            {/* 본문 */}
            <div className={styles.detailContent}>{item.content}</div>

            {/* 첨부파일 */}
            {item.files?.length ? (
              <>
                <div className={styles.sectionDivider} />
                <div className={styles.sectionTitleSm}>첨부파일</div>
                <ol className={styles.attachList}>
                  {item.files.map((f, i) => (
                    <li key={f.id}>
                      {i + 1}. {f.name}
                    </li>
                  ))}
                </ol>
              </>
            ) : null}
          </article>
        )}
      </div>
    </div>
  );
}
