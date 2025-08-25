'use client';
import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useRouter } from 'next/navigation';

interface CategorySettingsHeaderProps {
  onReset: () => void;
}

export default function CategorySettingsHeader({
  onReset,
}: CategorySettingsHeaderProps) {
  const router = useRouter();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: 2,
        backgroundColor: '#EEEEEE',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignContent: 'center',
        }}
      >
        {/* 뒤로가기 */}
        <IconButton onClick={() => router.back()} size="small">
          <ArrowBackIosIcon fontSize="small" />
        </IconButton>

        <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '19px' }}>
          카테고리 설정
        </Typography>
      </div>

      {/* 초기화 버튼 */}
      <IconButton
        onClick={onReset}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <RestartAltIcon sx={{ fontSize: 22 }} />
        <span style={{ fontSize: 8, marginTop: -3 }}>초기화</span>
      </IconButton>
    </Box>
  );
}
