import React from 'react';
import styles from '../Admin.module.css';
import { useAdminWrite } from './useAdminWrite';
import { MenuItem, Select } from '@mui/material';
import { InternalNoticeResponse } from '@/api';

export function AdminWriteForm() {
  const {
    title,
    setTitle,
    content,
    setContent,
    dragOver,
    departmentList,
    onDrop,
    onDragOver,
    onDragLeave,
    inputRef,
    onAddFiles,
    numberedFiles,
    onRemoveFile,
    targetDepartment,
    setTargetDepartment,
    targetYear,
    setTargetYear,
  } = useAdminWrite();
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
        <div className={styles.sectionTitle}>대상 선택</div>
        <Select
          value={targetDepartment?.id}
          onChange={(e) => {
            const dept = departmentList.find((d) => d.id === e.target.value);
            setTargetDepartment(dept || null);
          }}
        >
          <MenuItem value="">전체</MenuItem>
          {departmentList.map((department) => (
            <MenuItem key={department.id} value={department.id}>
              {department.name}
            </MenuItem>
          ))}
        </Select>
      </div>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>학년 선택</div>
        <Select
          value={targetYear}
          onChange={(e) =>
            setTargetYear(e.target.value as InternalNoticeResponse.targetYear)
          }
        >
          <MenuItem value={InternalNoticeResponse.targetYear.ALL_YEARS}>
            전체
          </MenuItem>
          <MenuItem value={InternalNoticeResponse.targetYear.FIRST_YEAR}>
            1학년
          </MenuItem>
          <MenuItem value={InternalNoticeResponse.targetYear.SECOND_YEAR}>
            2학년
          </MenuItem>
          <MenuItem value={InternalNoticeResponse.targetYear.THIRD_YEAR}>
            3학년
          </MenuItem>
          <MenuItem value={InternalNoticeResponse.targetYear.FOURTH_YEAR}>
            4학년
          </MenuItem>
        </Select>
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
