import React from 'react';
import styles from '../Admin.module.css';
import { CATEGORIES, FileItem } from './useAdminWrite';
import type { Category } from '@/app/admin/localNotice';

interface AdminWriteFormProps {
  title: string;
  setTitle: (v: string) => void;
  content: string;
  setContent: (v: string) => void;
  category: Category;
  setCategory: (v: Category) => void;
  numberedFiles: { no: number; name: string; id: string }[];
  dragOver: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onAddFiles: React.ChangeEventHandler<HTMLInputElement>;
  onRemoveFile: (id: string) => void;
  onDrop: React.DragEventHandler<HTMLDivElement>;
  onDragOver: React.DragEventHandler<HTMLDivElement>;
  onDragLeave: () => void;
}

export function AdminWriteForm({
  title,
  setTitle,
  content,
  setContent,
  category,
  setCategory,
  numberedFiles,
  dragOver,
  inputRef,
  onAddFiles,
  onRemoveFile,
  onDrop,
  onDragOver,
  onDragLeave,
}: AdminWriteFormProps) {
  return (
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
              className={`${styles.chip} ${category === c ? styles.chipActive : ''}`}
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
          className={`${styles.dropZone} ${dragOver ? styles.dropZoneActive : ''}`}
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
  );
}
