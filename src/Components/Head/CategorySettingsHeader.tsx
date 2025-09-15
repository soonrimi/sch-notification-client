'use client';
import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useRouter } from 'next/navigation';

interface SettingsHeaderProps {
  title: string;
  onReset?: () => void;
  backgroundColor?: string;
}

export default function CategorySettingsHeader({
  title,
  onReset,
  backgroundColor = '#f3f3f3ff',
}: SettingsHeaderProps) {
  const router = useRouter();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: 2,
        backgroundColor,
        height: 48,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* 뒤로가기 */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ArrowBackIosIcon
            onClick={() => router.back()}
            sx={{ fontSize: 20, cursor: 'pointer', mr: 1 }}
          />
          <Typography sx={{ fontWeight: 'bold', fontSize: '18px' }}>
            {title}
          </Typography>
        </Box>
      </Box>

      {/* 초기화 버튼 */}
      {onReset && (
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
      )}
    </Box>
  );
}
