'use client';

import styles from '../Admin.module.css';
import { useAdminWrite } from './useAdminWrite';
import { AdminWriteForm } from './AdminWriteForm';
import { useRouter } from 'next/navigation';

export default function AdminWritePage() {
  const router = useRouter();
  const { isValid, submitting, handleSubmit } = useAdminWrite();

  return (
    <div className={styles.adminRoot}>
      {/* 상단바 */}
      <header className={styles.topBar}>
        <button className={styles.topBtn} onClick={() => router.back()}>
          취소
        </button>
        <h1 className={styles.topTitle}>글 쓰기</h1>
        <button
          className={styles.topBtnPrimary}
          onClick={handleSubmit}
          disabled={!isValid || submitting}
        >
          {submitting ? '등록 중…' : '등록'}
        </button>
      </header>

      {/* 본문 폼 */}
      <AdminWriteForm />
    </div>
  );
}
