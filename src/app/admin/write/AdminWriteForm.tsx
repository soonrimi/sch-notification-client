'use client';

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';
import base from '../Admin.module.css';
import fancy from './WriteForm.module.css';
import { useAdminWrite } from './useAdminWrite';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { InternalNoticeResponse } from '@/api';

// 게시판(단일 선택)
type BoardCategory =
  | '학교'
  | '대학'
  | '학과'
  | '학년'
  | '채용'
  | '활동'
  | '홍보';

// 아이콘
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import WorkOutlineRoundedIcon from '@mui/icons-material/WorkOutlineRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded';

const CATEGORY_META: {
  key: BoardCategory;
  label: string;
  Icon: React.ElementType;
}[] = [
  { key: '학교', label: '학교', Icon: SchoolRoundedIcon },
  { key: '대학', label: '대학', Icon: ApartmentRoundedIcon },
  { key: '학과', label: '학과', Icon: GroupsRoundedIcon },
  { key: '학년', label: '학년', Icon: BadgeRoundedIcon },
  { key: '채용', label: '채용', Icon: WorkOutlineRoundedIcon },
  { key: '활동', label: '활동', Icon: EventAvailableRoundedIcon },
  { key: '홍보', label: '홍보', Icon: CampaignRoundedIcon },
];

type LocalNotice = {
  id: string;
  title: string;
  content: string;
  category: BoardCategory;
  year?:
    | typeof InternalNoticeResponse.targetYear.FIRST_YEAR
    | typeof InternalNoticeResponse.targetYear.SECOND_YEAR
    | typeof InternalNoticeResponse.targetYear.THIRD_YEAR
    | typeof InternalNoticeResponse.targetYear.FOURTH_YEAR;
  files: { id: string; name: string }[];
  createdAt: string; // ISO
};

const LS_KEY = 'SOONRIMI_LOCAL_NOTICES';

export type AdminWriteFormHandle = {
  /** 상단 "등록" 버튼에서 호출 → 로컬 저장 */
  submit: () => void;
};

export const AdminWriteForm = forwardRef<AdminWriteFormHandle>(
  function AdminWriteForm(_props, ref) {
    const router = useRouter();

    const {
      title,
      setTitle,
      content,
      setContent,
      dragOver,
      onDrop,
      onDragOver,
      onDragLeave,
      inputRef,
      onAddFiles,
      numberedFiles,
      onRemoveFile,
      targetYear,
      setTargetYear,
    } = useAdminWrite();

    // 게시판 카테고리(단일)
    const [category, setCategory] = useState<BoardCategory>('학교');

    // 학년 값은 항상 유효한 enum으로 유지
    const Year = InternalNoticeResponse.targetYear;
    const selectedYear = targetYear ?? Year.FIRST_YEAR;

    // 카테고리 변경 시 학년 초기화/보정
    useEffect(() => {
      if (category === '학년') {
        if (
          targetYear !== Year.FIRST_YEAR &&
          targetYear !== Year.SECOND_YEAR &&
          targetYear !== Year.THIRD_YEAR &&
          targetYear !== Year.FOURTH_YEAR
        ) {
          setTargetYear(Year.FIRST_YEAR);
        }
      } else {
        setTargetYear(Year.ALL_YEARS);
      }
    }, [category, targetYear, setTargetYear, Year]);

    const handleYearChange = (e: SelectChangeEvent) => {
      setTargetYear(
        e.target
          .value as unknown as typeof InternalNoticeResponse.targetYear.FIRST_YEAR
      );
    };

    // ------ 부모에서 호출하는 submit 핸들 바인딩 ------
    useImperativeHandle(ref, () => ({
      submit: () => {
        const trimmedTitle = title.trim();
        const trimmedContent = content.trim();
        if (!trimmedTitle || !trimmedContent) {
          alert('제목과 내용을 입력하세요.');
          return;
        }

        const notice: LocalNotice = {
          id: String(Date.now()),
          title: trimmedTitle,
          content: trimmedContent,
          category,
          year:
            category === '학년'
              ? (selectedYear as LocalNotice['year'])
              : undefined,
          files: numberedFiles.map((f) => ({ id: String(f.id), name: f.name })),
          createdAt: new Date().toISOString(),
        };

        try {
          const raw = localStorage.getItem(LS_KEY);
          const list: LocalNotice[] = raw ? JSON.parse(raw) : [];
          list.unshift(notice);
          localStorage.setItem(LS_KEY, JSON.stringify(list));
        } catch {
          /* localStorage 실패해도 화면 전환은 그대로 */
        }

        router.push('/admin');
      },
    }));

    // ------ UI ------
    return (
      <div className={base.formWrap}>
        {/* 제목 */}
        <label className={base.label}>제목</label>
        <input
          className={base.input}
          placeholder="제목을 입력하세요."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
        />

        {/* 내용 */}
        <label className={base.label}>내용</label>
        <textarea
          className={base.textarea}
          placeholder="내용을 입력하세요."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
        />

        {/* 게시판 선택(칩) */}
        <div className={base.section}>
          <div className={base.sectionTitle}>게시판 선택</div>
          <div className={fancy.sectionCard}>
            <div className={fancy.chips}>
              {CATEGORY_META.map(({ key, label, Icon }) => (
                <button
                  key={key}
                  type="button"
                  className={`${fancy.chip} ${category === key ? fancy.chipActive : ''}`}
                  onClick={() => setCategory(key)}
                  aria-pressed={category === key}
                  data-active={category === key} /* 활성 스타일 강제 적용 */
                >
                  <Icon className={fancy.icon} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 학년 선택: 카테고리가 '학년'일 때만 */}
        {category === '학년' && (
          <div className={base.section}>
            <div className={base.sectionTitle}>학년 선택</div>
            <div className={fancy.sectionCard}>
              <FormControl fullWidth size="small">
                <InputLabel id="year-label">학년 선택</InputLabel>
                <Select
                  labelId="year-label"
                  label="학년 선택"
                  value={selectedYear as unknown as string}
                  onChange={handleYearChange}
                  MenuProps={{
                    disablePortal: true, // removeChild 에러 방지
                    keepMounted: true,
                  }}
                >
                  <MenuItem value={Year.FIRST_YEAR}>1학년</MenuItem>
                  <MenuItem value={Year.SECOND_YEAR}>2학년</MenuItem>
                  <MenuItem value={Year.THIRD_YEAR}>3학년</MenuItem>
                  <MenuItem value={Year.FOURTH_YEAR}>4학년</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
        )}

        {/* 첨부파일 */}
        <div className={base.section}>
          <div className={base.sectionTitle}>첨부파일 추가</div>
          <div
            className={`${base.dropZone} ${dragOver ? base.dropZoneActive : ''} ${fancy.sectionCard}`}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onClick={() => inputRef.current?.click()}
            role="button"
            aria-label="파일을 끌어다 놓거나 클릭하여 선택"
            tabIndex={0}
          >
            <div className={base.dropHint}>
              클릭하여 파일 선택 또는 여기로 드래그
            </div>
            <input
              ref={inputRef}
              type="file"
              multiple
              onChange={onAddFiles}
              className={base.fileInput}
              aria-hidden
            />
          </div>

          <ol className={base.fileList}>
            {numberedFiles.map(({ no, name, id }) => (
              <li key={id} className={base.fileRow}>
                <span className={base.fileName}>
                  {no}. {name}
                </span>
                <button
                  type="button"
                  className={base.fileRemove}
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
);
