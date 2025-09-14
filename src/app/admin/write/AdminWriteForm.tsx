'use client';

import React, { ElementType, forwardRef, useEffect } from 'react';
import base from '../Admin.module.css';
import fancy from './WriteForm.module.css';
import { useAdminWrite } from './useAdminWrite';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { CrawlPostsResponse, InternalNoticeListResponse } from '@/api';

// 아이콘
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import WorkOutlineRoundedIcon from '@mui/icons-material/WorkOutlineRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded';

const CATEGORY_META: {
  categoryId: CrawlPostsResponse.category;
  label: string;
  Icon: ElementType;
}[] = [
  {
    categoryId: CrawlPostsResponse.category.UNIVERSITY,
    label: '대학',
    Icon: ApartmentRoundedIcon,
  },
  {
    categoryId: CrawlPostsResponse.category.DEPARTMENT,
    label: '학과',
    Icon: GroupsRoundedIcon,
  },
  {
    categoryId: CrawlPostsResponse.category.GRADE,
    label: '학년',
    Icon: BadgeRoundedIcon,
  },
  {
    categoryId: CrawlPostsResponse.category.RECRUIT,
    label: '채용',
    Icon: WorkOutlineRoundedIcon,
  },
  {
    categoryId: CrawlPostsResponse.category.ACTIVITY,
    label: '활동',
    Icon: EventAvailableRoundedIcon,
  },
  {
    categoryId: CrawlPostsResponse.category.PROMOTION,
    label: '홍보',
    Icon: CampaignRoundedIcon,
  },
];

export type AdminWriteFormHandle = {
  /** 상단 "등록" 버튼에서 호출 → 로컬 저장 */
  submit: () => void;
};

export const AdminWriteForm = forwardRef<AdminWriteFormHandle>(
  function AdminWriteForm(_props) {
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
      departmentList,
      targetDepartmentList,
      category,
      setCategory,
      setTargetDepartmentList,
    } = useAdminWrite();

    // 학년 값은 항상 유효한 enum으로 유지
    const Year = InternalNoticeListResponse.targetYear;
    const selectedYear = targetYear ?? Year.FIRST_YEAR;

    // 카테고리 변경 시 학년 초기화/보정
    useEffect(() => {
      if (category === CrawlPostsResponse.category.GRADE) {
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
          .value as unknown as typeof InternalNoticeListResponse.targetYear.FIRST_YEAR
      );
    };

    function handleChangeTargetDepartments(e: SelectChangeEvent<number[]>) {
      const {
        target: { value },
      } = e;
      setTargetDepartmentList(
        typeof value === 'string'
          ? []
          : departmentList.filter((d) => value.includes(d.id))
      );
    }

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
              {CATEGORY_META.map(({ categoryId, label, Icon }) => (
                <button
                  key={categoryId}
                  type="button"
                  className={`${fancy.chip} ${category === categoryId ? fancy.chipActive : ''}`}
                  onClick={() => setCategory(categoryId)}
                  aria-pressed={category === categoryId}
                  data-active={
                    category === categoryId
                  } /* 활성 스타일 강제 적용 */
                >
                  <Icon className={fancy.icon} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        {category === CrawlPostsResponse.category.DEPARTMENT && (
          <Stack>
            <Select
              multiple
              value={targetDepartmentList.map((d) => d.id)}
              onChange={(e) => handleChangeTargetDepartments(e)}
              displayEmpty
            >
              {departmentList.map((dept) => (
                <MenuItem key={dept.id} value={dept.id}>
                  {dept.name}
                </MenuItem>
              ))}
            </Select>
          </Stack>
        )}
        {category === CrawlPostsResponse.category.GRADE && (
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
                  <MenuItem value={Year.ALL_YEARS}>전체</MenuItem>
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
