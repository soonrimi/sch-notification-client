'use client';

import React, {
  ElementType,
  forwardRef,
  useEffect,
  useImperativeHandle,
} from 'react';
import base from '../Admin.module.css';
import fancy from './WriteForm.module.css';
import { useAdminWrite } from './useAdminWrite';
import {
  Autocomplete,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { CreateInternalNoticeRequest, InternalNoticeListResponse } from '@/api';

// 아이콘
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import WorkOutlineRoundedIcon from '@mui/icons-material/WorkOutlineRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded';

// Year 변수를 컴포넌트 밖으로 이동시켜, 렌더링 시 새로 생성되지 않도록 합니다.
const Year = InternalNoticeListResponse.targetYear;

const CATEGORY_META: {
  categoryId: CreateInternalNoticeRequest.category;
  label: string;
  Icon: ElementType;
}[] = [
  {
    categoryId: CreateInternalNoticeRequest.category.UNIVERSITY,
    label: '대학',
    Icon: ApartmentRoundedIcon,
  },
  {
    categoryId: CreateInternalNoticeRequest.category.DEPARTMENT,
    label: '학과',
    Icon: GroupsRoundedIcon,
  },
  {
    categoryId: CreateInternalNoticeRequest.category.GRADE,
    label: '학년',
    Icon: BadgeRoundedIcon,
  },
  {
    categoryId: CreateInternalNoticeRequest.category.RECRUIT,
    label: '채용',
    Icon: WorkOutlineRoundedIcon,
  },
  {
    categoryId: CreateInternalNoticeRequest.category.ACTIVITY,
    label: '활동',
    Icon: EventAvailableRoundedIcon,
  },
  {
    categoryId: CreateInternalNoticeRequest.category.PROMOTION,
    label: '홍보',
    Icon: CampaignRoundedIcon,
  },
];

export type AdminWriteFormHandle = {
  /** 상단 "등록" 버튼에서 호출 → 로컬 저장 */
  submit: () => void;
};

export const AdminWriteForm = forwardRef<AdminWriteFormHandle>(
  function AdminWriteForm(_props, ref) {
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
      handleSubmit,
      setTargetDepartmentList, // 여기에 빠뜨렸던 부분을 추가했습니다!
    } = useAdminWrite();

    useImperativeHandle(
      ref,
      () => ({
        submit: handleSubmit,
      }),
      [handleSubmit]
    );

    useEffect(() => {
      if (category !== 'GRADE') {
        setTargetYear(Year.ALL_YEARS);
      }
    }, [category, setTargetYear]);

    const handleYearChange = (e: SelectChangeEvent) => {
      setTargetYear(e.target.value as InternalNoticeListResponse.targetYear);
    };

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
                  className={`${fancy.chip} ${
                    category === categoryId ? fancy.chipActive : ''
                  }`}
                  onClick={() => setCategory(categoryId)}
                  aria-pressed={category === categoryId}
                  data-active={category === categoryId}
                >
                  <Icon className={fancy.icon} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 학과 선택 (Autocomplete UI) */}
        {(category === 'DEPARTMENT' || category === 'GRADE') && (
          <Stack sx={{ my: 2 }}>
            <Autocomplete
              multiple
              autoHighlight
              options={departmentList}
              getOptionLabel={(option) => option.name}
              value={targetDepartmentList}
              onChange={(event, newValue) => {
                setTargetDepartmentList(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="학과 선택"
                  placeholder="검색하여 학과 추가"
                />
              )}
              isOptionEqualToValue={(option, value) => option.id === value.id}
            />
          </Stack>
        )}

        {/* 학년 선택 */}
        {category === 'GRADE' && (
          <div className={base.section}>
            <div className={base.sectionTitle}>학년 선택</div>
            <div className={fancy.sectionCard}>
              <FormControl fullWidth size="small">
                <InputLabel id="year-label">학년 선택</InputLabel>
                <Select
                  labelId="year-label"
                  label="학년 선택"
                  value={targetYear}
                  onChange={handleYearChange}
                  MenuProps={{
                    disablePortal: true,
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
            className={`${base.dropZone} ${
              dragOver ? base.dropZoneActive : ''
            } ${fancy.sectionCard}`}
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
