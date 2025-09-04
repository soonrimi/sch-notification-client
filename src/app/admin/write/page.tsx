'use client';

import Layout from '@/Components/LayoutDir/Layout';
import styles from '../Admin.module.css';
import { useAdminWrite } from './useAdminWrite';
import { AdminWriteForm } from './AdminWriteForm';
import { useRouter } from 'next/navigation';

export default function AdminWritePage() {
  const router = useRouter();
  const { isValid, submitting, handleSubmit } = useAdminWrite();

  return (
    <Layout>
      <div className={styles.adminRoot}>
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
        <AdminWriteForm />
      </div>
    </Layout>
  );
}
