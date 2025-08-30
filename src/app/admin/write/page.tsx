'use client';

import Layout from '@/Components/LayoutDir/Layout';
import styles from '../Admin.module.css';
import { useAdminWrite } from './useAdminWrite';
import { AdminWriteForm } from './AdminWriteForm';

export default function AdminWritePage() {
  const {
    router,
    inputRef,
    title,
    setTitle,
    content,
    setContent,
    category,
    setCategory,
    numberedFiles,
    dragOver,
    onAddFiles,
    onRemoveFile,
    onDrop,
    onDragOver,
    onDragLeave,
    isValid,
    submitting,
    handleSubmit,
  } = useAdminWrite();

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
        <AdminWriteForm
          title={title}
          setTitle={setTitle}
          content={content}
          setContent={setContent}
          category={category}
          setCategory={setCategory}
          numberedFiles={numberedFiles}
          dragOver={dragOver}
          inputRef={inputRef}
          onAddFiles={onAddFiles}
          onRemoveFile={onRemoveFile}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
        />
      </div>
    </Layout>
  );
}
