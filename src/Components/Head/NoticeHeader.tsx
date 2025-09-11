'use client';

import React from 'react';
import { Stack, Typography, IconButton } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ShareIcon from '@mui/icons-material/Share';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { useRouter } from 'next/navigation';
import { Category } from '@/types/notice';

export interface NoticeHeaderProps {
  category: Category;
  noticeId: string;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  isRead?: boolean;
}

export default function NoticeHeader({
  category,
  noticeId,
  isBookmarked,
  onToggleBookmark,
}: NoticeHeaderProps) {
  const router = useRouter();

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        px: 2,
        height: 40,
        backgroundColor: '#ffffff',
        marginTop: '15px',
      }}
    >
      {/* 뒤로가기 */}
      <IconButton onClick={() => router.back()}>
        <ArrowBackIosIcon fontSize="small" sx={{ color: '#333333' }} />
      </IconButton>

      {/* 카테고리 */}
      <Typography variant="subtitle1" fontWeight="bold" fontSize={18}>
        {category.name} 공지
      </Typography>

      {/* 공유 + 북마크 */}
      <Stack direction="row" spacing={-0.9}>
        <IconButton
          onClick={async () => {
            const url = window.location.href;
            const title = `${category.name} 공지`;

            if (navigator.share) {
              try {
                await navigator.share({
                  title,
                  text: `이 공지를 확인해보세요: ${title}`,
                  url,
                });
              } catch (err) {
                console.error('공유 실패:', err);
              }
            } else {
              navigator.clipboard.writeText(url);
              alert('링크가 복사되었습니다.');
            }
          }}
        >
          <ShareIcon sx={{ fontSize: 20 }} />
        </IconButton>

        <IconButton onClick={() => onToggleBookmark(noticeId)}>
          {isBookmarked ? (
            <BookmarkIcon sx={{ fontSize: 23, color: '#FFD700' }} />
          ) : (
            <BookmarkBorderIcon sx={{ fontSize: 23, color: '#A1A1A1' }} />
          )}
        </IconButton>
      </Stack>
    </Stack>
  );
}
