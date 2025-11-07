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
  BookmarkDeleteMode,
  selectedCount,
  totalCount,
  onToggleBookmarkDeleteMode,
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
        width: '100%',
        height: '100%',
        backgroundColor: '#ffffff',
      }}
    >
      {/* 왼쪽: 뒤로가기 + 제목 */}
      <Stack direction="row" alignItems="center" spacing={1}>
        {BookmarkDeleteMode && (
          <IconButton onClick={onCancelSelection} size="small">
            <ArrowBackIosIcon fontSize="small" sx={{ color: '#333333' }} />
          </IconButton>
        )}
        <Typography variant="subtitle1" fontWeight="bold" fontSize={18}>
          {BookmarkDeleteMode
            ? isAnySelected
              ? `${selectedCount}개 선택됨`
              : '항목 선택'
            : '북마크'}
        </Typography>
      </Stack>

      {/* 오른쪽 버튼 - HomeHeader와 동일한 레이아웃/간격 */}
      <Stack
        direction="row"
        alignItems="center"
        className={styles.header_right_home}
      >
        {BookmarkDeleteMode ? (
          <IconButton
            onClick={onSelectAll}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              color: iconColor,
              p: 0,
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
                router.push('/search?scope=bookmark&from=bookmark');
              }}
              sx={{ p: 0 }}
            >
              <Image
                src="/icons/search_icon.png"
                alt="검색"
                width={18}
                height={21}
                className={styles.icon_small}
              />
            </IconButton>
            <IconButton onClick={onToggleBookmarkDeleteMode} sx={{ p: 0 }}>
              <DeleteOutlineIcon sx={{ fontSize: 23.5, color: '#333333' }} />
            </IconButton>
          </>
        )}
      </Stack>
    </Stack>
  );
}
