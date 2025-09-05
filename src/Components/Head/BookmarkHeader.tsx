'use client';

import React from 'react';
import { Stack, Typography, IconButton } from '@mui/material';
import styles from './Header.module.css';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import Image from 'next/image';
import { BookmarkHeaderProps } from './Header';
import { useRouter } from 'next/navigation';

export default function BookmarkHeader({
  selectionMode,
  selectedCount,
  totalCount,
  onToggleSelectionMode,
  onSelectAll,
  onCancelSelection,
}: BookmarkHeaderProps) {
  const isAnySelected = selectedCount > 0;
  const iconColor = isAnySelected ? '#bda100ff' : '#A1A1A1';
  const router = useRouter();

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        px: 2,
        height: 50,
        backgroundColor: '#ffffff',
      }}
    >
      {/* 왼쪽: 뒤로가기 + 제목 */}
      <Stack direction="row" alignItems="center" spacing={1}>
        {selectionMode && (
          <IconButton onClick={onCancelSelection} size="small">
            <ArrowBackIosIcon fontSize="small" sx={{ color: '#333333' }} />
          </IconButton>
        )}
        <Typography variant="subtitle1" fontWeight="bold" fontSize={18}>
          {selectionMode
            ? isAnySelected
              ? `${selectedCount}개 선택됨`
              : '항목 선택'
            : '북마크'}
        </Typography>
      </Stack>

      {/* 오른쪽 버튼 */}
      <Stack direction="row" alignItems="center" spacing={-0.6}>
        {selectionMode ? (
          <IconButton
            onClick={onSelectAll}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              color: iconColor,
              position: 'relative',
              right: '-13px',
            }}
          >
            {selectedCount === totalCount && totalCount > 0 ? (
              <CheckCircleIcon sx={{ fontSize: 22, color: iconColor }} />
            ) : (
              <RadioButtonUncheckedIcon
                sx={{ fontSize: 22, color: iconColor }}
              />
            )}
            <Typography sx={{ fontSize: 9, color: '#333333', mt: '-1px' }}>
              전체
            </Typography>
          </IconButton>
        ) : (
          <>
            <IconButton
              onClick={() => {
                router.push('/search?scope=bookmark');
              }}
            >
              <Image
                src="/icons/search_icon.png"
                alt="검색"
                width={18}
                height={21}
                className={styles.icon_small}
              />
            </IconButton>
            <IconButton onClick={onToggleSelectionMode}>
              <DeleteOutlineIcon
                sx={{ fontSize: 23.5, color: '#333333', marginRight: -1.1 }}
              />
            </IconButton>
          </>
        )}
      </Stack>
    </Stack>
  );
}
