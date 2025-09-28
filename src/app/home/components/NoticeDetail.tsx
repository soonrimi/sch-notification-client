'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/Components/LayoutDir/Layout';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Drawer,
} from '@mui/material';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { CrawlPostControllerService } from '@/api/services/CrawlPostControllerService';
import type { DetailResponse } from '@/api/models/DetailResponse';
import { useBookmark } from '@/hooks/useBookmark';
import { Category } from '@/constants/categories';
import { formatUploadTime } from '@/utils/NoticeDate';
import { useSwipeable } from 'react-swipeable';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

interface NoticeDetailProps {
  id: string;
}

// NoticeItem 스타일의 Date 변환용 타입
interface NoticeWithDate extends Omit<DetailResponse, 'createdAt'> {
  upload_time: Date | null;
}

export default function NoticeDetail({ id }: NoticeDetailProps) {
  const [notice, setNotice] = useState<NoticeWithDate | null>(null);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const { bookmarked, toggleBookmark } = useBookmark(notice?.id ?? 0);
  const handlers = useSwipeable({
    onSwipedDown: () => setOpenModal(false),
  });

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
    if (!attachments.length) return;

    attachments
      .filter(
        (f): f is { fileUrl: string; fileName: string } =>
          !!f.fileUrl && !!f.fileName
      )
      .forEach((file, idx) => {
        setTimeout(() => {
          const link = document.createElement('a');
          link.href = file.fileUrl;
          link.download = file.fileName;
          document.body.appendChild(link);
          link.click();
          link.remove();
        }, idx * 200);
      });
  };





  return (
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
      <Box sx={{ p: 3 }}>
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

      {/* 오른쪽 하단 고정 버튼 */}
      {attachments.length > 0 && (
        <IconButton
          onClick={() => setOpenModal(true)}
          sx={{
            position: 'fixed',
            bottom: '1.1675rem',
            right: '1rem',
            bgcolor: '#3182F7',
            width: '3.1rem',
            height: '3.1rem',
            borderRadius: '30%',
            '&:hover': { bgcolor: '#f5f5f5' },
          }}
        >
          <ArrowDownwardIcon
            sx={{
              fontSize: '1.8125rem',
              color: attachments.length ? '#ffffffff' : '#c3c3c3ff',
            }}
          />
        </IconButton>
      )}

      {/* 첨부파일 모달 */}
      
    </Layout>
  );
}
