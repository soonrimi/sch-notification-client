'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/Components/LayoutDir/Layout';
import { Box, Typography } from '@mui/material';
import { CrawlPostControllerService } from '@/api/services/CrawlPostControllerService';
import type { DetailResponse } from '@/api/models/DetailResponse';
import { useBookmark } from '@/hooks/useBookmark';
import { Category } from '@/constants/categories';
import { formatUploadTime } from '@/utils/NoticeDate';
import { AttachmentDrawer } from './AttachmentDrawer';
import type { Attachment } from './types';

interface NoticeDetailProps {
  id: string;
}

// NoticeItem 스타일의 Date 변환용 타입
interface NoticeWithDate extends Omit<DetailResponse, 'createdAt'> {
  upload_time: Date | null;
}
export function NoticeDetail({ id }: NoticeDetailProps) {
  const [notice, setNotice] = useState<NoticeWithDate | null>(null);
  const [loading, setLoading] = useState(true);
  const { bookmarked, toggleBookmark } = useBookmark(notice?.id ?? 0);

  useEffect(() => {
    async function fetchNotice() {
      setLoading(true);
      try {
        const data = await CrawlPostControllerService.getNotice(Number(id));

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

  if (loading) return <Layout hideBottomNav>로딩중...</Layout>;
  if (!notice)
    return <Layout hideBottomNav>해당 공지를 찾을 수 없습니다.</Layout>;

  // AttachmentResponse를 Attachment 타입으로 변환
  const attachments: Attachment[] = (notice?.attachments ?? []).map((att) => ({
    fileName: att.fileName,
    fileUrl: att.fileUrl,
  }));

  return (
    <>
      <Layout
        headerProps={{
          pageType: 'contentdetail',
          noticeHeaderProps: {
            category: notice.categoryName as Category,
            noticeId: notice.id ?? 0,
            isBookmarked: bookmarked,
            onToggleBookmark: toggleBookmark,
          },
        }}
        hideBottomNav
      >
        <Box sx={{ p: 3, pb: attachments.length > 0 ? '5rem' : 3 }}>
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
            fontSize="0.8rem"
            gap="1rem"
          >
            <span>{notice.writer ?? ''}</span>
            <span>{formatUploadTime(notice.upload_time) ?? ''}</span>
            <span>조회수 {notice.viewCount ?? 0}회</span>
          </Typography>
          <hr
            style={{
              position: 'absolute',
              left: 0,
              width: '100%',
              border: 'none',
              borderTop: '1px solid #242424',
              transform: 'scaleY(0.3)',
              marginTop: '0.1875rem',
            }}
          />
          <Typography
            variant="body2"
            whiteSpace="pre-line"
            mb={3}
            mt={3.8}
            fontSize="15px"
            dangerouslySetInnerHTML={{ __html: notice.content ?? '' }}
          />
        </Box>
      </Layout>

      {/* Layout 밖으로 이동 */}
      {attachments.length > 0 && <AttachmentDrawer attachments={attachments} />}
    </>
  );
}
