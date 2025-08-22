'use client';

import { useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../Admin.module.css';
import Layout from '@/Components/LayoutDir/Layout';
import { addNotice, type Category, type LocalNotice } from '../localNotice';

const CATEGORIES: Category[] = [
  '대학',
  '학교',
  '학년',
  '채용',
  '활동',
  '홍보',
  '전체',
];

type FileItem = { id: string; file: File };

export default function AdminWritePage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Category>('전체');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const numberedFiles = useMemo(
    () => files.map((f, i) => ({ no: i + 1, name: f.file.name, id: f.id })),
    [files],
  );

  const appendFiles = (list: FileList | null) => {
    if (!list) return;
    const next: FileItem[] = Array.from(list).map((f) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      file: f,
    }));
    setFiles((prev) => [...prev, ...next]);
  };

  const onAddFiles: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    appendFiles(e.target.files);
    e.currentTarget.value = ''; // 같은 파일 재선택 가능
  };

  const onRemoveFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  // Drag & Drop
  const onDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    setDragOver(false);
    appendFiles(e.dataTransfer.files);
  };
  const onDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    if (!dragOver) setDragOver(true);
  };
  const onDragLeave: React.DragEventHandler<HTMLDivElement> = () => {
    setDragOver(false);
  };

  const isValid = title.trim().length > 0 && content.trim().length > 0;

  const handleSubmit = () => {
    if (!isValid) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }
    setSubmitting(true);
    try {
      const newItem: LocalNotice = {
        id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        title: title.trim(),
        content: content.trim(),
        category,
        createdAt: new Date().toISOString(),
        // 서버 업로드 없음 → 파일명만 저장
        attachments: files.map((f) => ({ name: f.file.name })),
      };
      addNotice(newItem);
      // 성공 알림 없이 바로 목록으로 이동
      router.push('/admin');
    } finally {
      setSubmitting(false);
    }
  };

  // 헤더(검색/설정) 숨기려면 pageType을 전달하지 않음
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

        <div className={styles.formWrap}>
          <label className={styles.label}>제목</label>
          <input
            className={styles.input}
            placeholder="제목을 입력하세요."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
          />

          <label className={styles.label}>내용</label>
          <textarea
            className={styles.textarea}
            placeholder="내용을 입력하세요."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
          />

          <div className={styles.section}>
            <div className={styles.sectionTitle}>카테고리 선택</div>
            <div className={styles.chips}>
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`${styles.chip} ${
                    category === c ? styles.chipActive : ''
                  }`}
                  onClick={() => setCategory(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>첨부파일 추가</div>

            <div
              className={`${styles.dropZone} ${
                dragOver ? styles.dropZoneActive : ''
              }`}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onClick={() => inputRef.current?.click()}
              role="button"
              aria-label="파일을 끌어다 놓거나 클릭하여 선택"
              tabIndex={0}
            >
              <div className={styles.dropHint}>
                클릭하여 파일 선택 또는 여기로 드래그
              </div>
              <input
                ref={inputRef}
                type="file"
                multiple
                onChange={onAddFiles}
                className={styles.fileInput}
                aria-hidden
              />
            </div>

            <ol className={styles.fileList}>
              {numberedFiles.map(({ no, name, id }) => (
                <li key={id} className={styles.fileRow}>
                  <span className={styles.fileName}>
                    {no}. {name}
                  </span>
                  <button
                    type="button"
                    className={styles.fileRemove}
                    onClick={() => onRemoveFile(id)}
                    aria-label={`${name} 제거`}
                    title="제거"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </Layout>
  );
}
