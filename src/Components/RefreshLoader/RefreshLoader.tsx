'use client';

import React from 'react';
import { CircularProgress } from '@mui/material';

interface RefreshLoaderProps {
  /** primary 색상 사용 여부 (기본값: false) */
  primary?: boolean;
}

/**
 * InfiniteScroll의 pullDownToRefreshContent/releaseToRefreshContent용 로더 컴포넌트
 */
export default function RefreshLoader({ primary = false }: RefreshLoaderProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 60,
      }}
    >
      <CircularProgress
        variant="indeterminate"
        color={primary ? 'primary' : undefined}
        size={24}
        style={{ color: primary ? undefined : '#999' }}
      />
    </div>
  );
}
