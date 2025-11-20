'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Stack, Typography, IconButton } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ShareIcon from '@mui/icons-material/Share';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { useRouter } from 'next/navigation';
import { Category } from '@/constants/categories';
import { ensureKakao } from '@/lib/kakao';

export interface NoticeHeaderProps {
  category: Category;
  noticeId: number;
  isBookmarked: boolean;
  onToggleBookmark: (id: number) => void;
  shareInfo?: {
    title: string;
    description: string;
    imageUrl?: string;
    url: string;
  };
}

export default function NoticeHeader({
  category,
  noticeId,
  isBookmarked,
  onToggleBookmark,
  shareInfo,
}: NoticeHeaderProps) {
  const router = useRouter();
  const [kakaoReady, setKakaoReady] = useState(false);

  useEffect(() => {
    const appKey = process.env.NEXT_PUBLIC_KAKAO_APP_KEY;
    if (!shareInfo || !appKey) return;
    ensureKakao(appKey)
      .then((instance) => {
        if (instance) setKakaoReady(true);
      })
      .catch((err) => {
        console.warn('카카오 SDK 로드 실패', err);
        setKakaoReady(false);
      });
  }, [shareInfo]);

  const copyFallback = useCallback((url: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(url)
        .then(() => alert('링크가 복사되었습니다.'))
        .catch(() => alert('링크 복사에 실패했습니다. 직접 공유해주세요.'));
    } else {
      alert('브라우저가 링크 복사를 지원하지 않습니다. 직접 공유해주세요.');
    }
  }, []);

  const handleShare = useCallback(async () => {
    const url = shareInfo?.url || window.location.href;
    const title = shareInfo?.title || `${category} 공지`;
    const description =
      shareInfo?.description || '순천향대학교 공지사항을 확인해보세요.';

    const appKey = process.env.NEXT_PUBLIC_KAKAO_APP_KEY;

    // 1) 카카오 공유 우선
    if (kakaoReady && window.Kakao && appKey && shareInfo) {
      try {
        window.Kakao.Share.sendDefault({
          objectType: 'feed',
          content: {
            title,
            description,
            imageUrl:
              shareInfo.imageUrl ||
              'https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_small.png',
            link: {
              mobileWebUrl: url,
              webUrl: url,
            },
          },
          buttons: [
            {
              title: '순리미에서 확인',
              link: {
                mobileWebUrl: url,
                webUrl: url,
              },
            },
          ],
        });
        return;
      } catch (err) {
        console.warn('카카오 공유 실패, 기본 공유로 fallback', err);
      }
    }

    // 2) Web Share API
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        });
        return;
      } catch (err) {
        console.warn('Web Share API 실패, 클립보드로 fallback', err);
      }
    }

    // 3) fallback: 클립보드
    copyFallback(url);
  }, [category, copyFallback, kakaoReady, shareInfo]);

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
      <Stack direction="row" alignItems="center" spacing={0}>
        <IconButton onClick={() => router.back()}>
          <ArrowBackIosIcon fontSize="small" sx={{ color: '#333333' }} />
        </IconButton>

        <Typography variant="subtitle1" fontWeight="550" fontSize={17}>
          {category} 공지
        </Typography>
      </Stack>

      {/* 오른쪽: 공유 + 북마크 */}
      <Stack direction="row" spacing={0.3}>
        <IconButton onClick={handleShare}>
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
