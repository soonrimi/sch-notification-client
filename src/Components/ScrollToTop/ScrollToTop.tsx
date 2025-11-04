'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Fab } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

interface ScrollToTopProps {
  /** 스크롤 컨테이너의 ID */
  scrollableTargetId: string;
  /** 버튼을 표시할 최소 스크롤 위치 (기본값: 100px) */
  showThreshold?: number;
  /** 버튼의 하단 위치 (기본값: 80px) */
  bottom?: number;
  /** 버튼의 오른쪽 위치 (기본값: 20px) */
  right?: number;
}

export default function ScrollToTop({
  scrollableTargetId,
  showThreshold = 100,
  bottom = 80,
  right = 20,
}: ScrollToTopProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const prevScrollPos = useRef(0);

  // 스크롤 이벤트 감지 (위로 스크롤 시 버튼 표시)
  useEffect(() => {
    const scrollContainer = document.getElementById(scrollableTargetId);
    if (!scrollContainer) return;

    const handleScroll = () => {
      const currentScrollPos = scrollContainer.scrollTop;

      // 위로 스크롤 중이고, threshold 이상 스크롤된 경우에만 버튼 표시
      if (
        prevScrollPos.current > currentScrollPos &&
        currentScrollPos > showThreshold
      ) {
        setShowScrollTop(true);
      } else if (
        currentScrollPos <= showThreshold ||
        prevScrollPos.current < currentScrollPos
      ) {
        // 최상단 근처에 있거나 아래로 스크롤 중이면 버튼 숨김
        setShowScrollTop(false);
      }

      prevScrollPos.current = currentScrollPos;
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [scrollableTargetId, showThreshold]);

  // 최상단으로 스크롤
  const scrollToTop = () => {
    const scrollContainer = document.getElementById(scrollableTargetId);
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
      setShowScrollTop(false);
    }
  };

  if (!showScrollTop) return null;

  return (
    <Fab
      onClick={scrollToTop}
      sx={{
        position: 'fixed',
        bottom: bottom,
        right: right,
        backgroundColor: '#fff',
        color: '#333',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        '&:hover': {
          backgroundColor: '#f5f5f5',
        },
        zIndex: 1000,
      }}
      size="medium"
      aria-label="맨 위로"
    >
      <KeyboardArrowUpIcon />
    </Fab>
  );
}
