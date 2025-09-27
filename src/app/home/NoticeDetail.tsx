'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/Components/LayoutDir/Layout';
import { Box, Typography, Stack, Button, IconButton } from '@mui/material';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { CrawlPostControllerService } from '@/api/services/CrawlPostControllerService';
import type { CrawlPostsResponse } from '@/api/models/CrawlPostsResponse';
import { useBookmark } from '@/hooks/useBookmark';
import { Category } from '@/constants/categories';
import { formatUploadTime } from '@/utils/NoticeDate';

interface NoticeDetailProps {
  id: string;
}

// HomeNotice 스타일의 Date 변환용 타입
interface NoticeWithDate extends Omit<CrawlPostsResponse, 'createdAt'> {
  upload_time: Date | null;
}

export default function NoticeDetail({ id }: NoticeDetailProps) {
  const [notice, setNotice] = useState<NoticeWithDate | null>(null);
  const [loading, setLoading] = useState(true);

  const { bookmarked, toggleBookmark } = useBookmark(notice?.id ?? 0);

  useEffect(() => {
    async function fetchNotice() {
      setLoading(true);
      try {
        const data = await CrawlPostControllerService.getNotice(Number(id));

        // createdAt(string) → Date 변환
        setNotice({
          ...data,
          upload_time: data.createdAt ? new Date(data.createdAt) : null,
        });
      } catch (err) {
        console.error('공지 불러오기 실패', err);
        setNotice(null);
      } finally {
        setLoading(false);
      }
    }

    fetchNotice();
  }, [id]);

  // 읽음 처리
  useEffect(() => {
    if (!notice?.id) return;

    const readNotices: number[] = JSON.parse(
      localStorage.getItem('readNotices') || '[]'
    );
    if (!readNotices.includes(notice.id)) {
      readNotices.push(notice.id);
      localStorage.setItem('readNotices', JSON.stringify(readNotices));
    }
  }, [notice]);

  if (loading) return <Layout hideBottomNav>로딩중...</Layout>;
  if (!notice)
    return <Layout hideBottomNav>해당 공지를 찾을 수 없습니다.</Layout>;

  const attachments = notice.attachments ?? [];

  const handleDownloadAll = () => {
    attachments.forEach((file) => {
      if (!file.fileUrl || !file.fileName) return;
      const link = document.createElement('a');
      link.href = file.fileUrl;
      link.download = file.fileName;
      link.click();
    });
  };

  return (
    <Layout
      headerProps={{
        pageType: 'contentdetail',
        noticeHeaderProps: {
          category: notice.category as Category,
          noticeId: notice.id ?? 0,
          isBookmarked: bookmarked,
          onToggleBookmark: toggleBookmark,
        },
      }}
      hideBottomNav
      footerSlot={
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 1,
            bgcolor: 'white',
            height: 48,
          }}
        >
          <Box
            sx={{
              flex: 9,
              overflowX: 'auto',
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
            }}
          >
            <Stack direction="row" spacing={1.1} alignItems="center">
              {attachments.map((file, idx) => (
                <Button
                  key={idx}
                  variant="outlined"
                  sx={{
                    height: 30,
                    maxWidth: 160,
                    px: 1,
                    borderRadius: '20px',
                    borderColor: '#aaa',
                    color: 'black',
                    bgcolor: 'white',
                    flexShrink: 0,
                  }}
                  onClick={() => {
                    if (!file.fileUrl || !file.fileName) return;
                    const link = document.createElement('a');
                    link.href = file.fileUrl;
                    link.download = file.fileName;
                    link.click();
                  }}
                >
                  <Box
                    sx={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      fontSize: '13px',
                    }}
                  >
                    {file.fileName}
                  </Box>
                </Button>
              ))}
            </Stack>
          </Box>
          <Box sx={{ flex: 1.1, textAlign: 'center' }}>
            <IconButton onClick={handleDownloadAll} sx={{ bgcolor: 'white' }}>
              <SystemUpdateAltIcon
                sx={{ fontSize: 29, color: '#2e2e2e', marginRight: -1 }}
              />
            </IconButton>
          </Box>
        </Box>
      }
    >
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AccountBoxIcon
            sx={{ color: '#d8d8d8', fontSize: 50, mr: 0.5, marginLeft: -0.8 }}
          />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              height: 37.5,
            }}
          >
            <Typography
              variant="caption"
              fontSize="15px"
              sx={{ lineHeight: 1.3, fontWeight: 400, color: '#000000' }}
            >
              국제교육교류처
            </Typography>
            <Typography
              variant="caption"
              fontSize="13px"
              color="text.secondary"
              sx={{ lineHeight: 1.3 }}
            >
              {formatUploadTime(notice.upload_time)}
            </Typography>
          </Box>
        </Box>

        <Typography
          variant="subtitle1"
          fontWeight="600"
          fontSize={19}
          mb={1}
          sx={{ lineHeight: 1.5, marginTop: 1 }}
        >
          {notice.title}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          mb={1}
          display="flex"
          fontSize="14px"
        >
          <span>조회수 {notice.viewCount ?? 0}회</span>
        </Typography>

        <Typography
          variant="body2"
          whiteSpace="pre-line"
          mb={3}
          mt={3}
          fontSize="15px"
          dangerouslySetInnerHTML={{ __html: notice.content ?? '' }}
        />
      </Box>
    </Layout>
  );
}
