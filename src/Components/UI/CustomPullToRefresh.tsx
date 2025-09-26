'use client';

import React, { ReactNode } from 'react';
import PullToRefresh from 'react-pull-to-refresh';
import { CircularProgress } from '@mui/material';

interface CustomPullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: ReactNode;
  scrollableTarget: string;
}

const CustomPullToRefresh: React.FC<CustomPullToRefreshProps> = ({
  onRefresh,
  children,
  scrollableTarget,
}) => {
  return (
    <PullToRefresh
      onRefresh={onRefresh}
      pullDownThreshold={60}
      resistance={2.5}
      refreshingContent={<CircularProgress color="inherit" />}
      pullingContent={<div>dkdkdkdk</div>}
      scrollableTarget={scrollableTarget}
    >
      {children}
    </PullToRefresh>
  );
};

export default CustomPullToRefresh;
