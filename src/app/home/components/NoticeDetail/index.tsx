'use client';

import React, { useEffect, useState, useRef } from 'react';
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
  const requestRef = useRef<{ cancel: () => void } | null>(null);
  const { bookmarked, toggleBookmark } = useBookmark(notice?.id ?? 0);

  useEffect(() => {
    let isCancelled = false;
    const currentId = id; // 현재 id를 캡처

    async function fetchNotice() {
      // 이전 요청이 있으면 취소
      if (requestRef.current) {
        console.log('[NoticeDetail] 이전 요청 취소');
        requestRef.current.cancel();
        requestRef.current = null;
      }

      // id가 변경되었거나 컴포넌트가 unmount된 경우 요청하지 않음
      if (currentId !== id || isCancelled) {
        console.log('[NoticeDetail] 요청 취소 - id 변경 또는 컴포넌트 unmount');
        return;
      }

      setLoading(true);
      const promise = CrawlPostControllerService.getNotice(Number(id));
      requestRef.current = promise;

      try {
        console.log(`[NoticeDetail] 공지 ${id} 요청 시작`);
        const data = await promise;
        console.log(`[NoticeDetail] 공지 ${id} 요청 성공`, data);

        // 컴포넌트가 unmount되었거나 id가 변경된 경우 상태 업데이트 방지
        if (
          !isCancelled &&
          currentId === id &&
          requestRef.current === promise
        ) {
          console.log(`[NoticeDetail] 상태 업데이트 시작`);
          setNotice({
            ...data,
            upload_time: data.createdAt ? new Date(data.createdAt) : null,
          });
          console.log(`[NoticeDetail] 상태 업데이트 완료`);
        } else {
          console.log(
            `[NoticeDetail] 상태 업데이트 취소됨 - isCancelled: ${isCancelled}, currentId: ${currentId}, id: ${id}, requestRef: ${requestRef.current === promise}`
          );
        }
      } catch (err: unknown) {
        // CancelError는 무시
        if (
          err instanceof Error &&
          (err.name === 'CancelError' || (err as { isCancelled?: boolean }).isCancelled)
        ) {
          console.log('[NoticeDetail] 요청 취소됨');
          return;
        }
        console.error('공지 불러오기 실패', err);
        if (!isCancelled && currentId === id) {
          setNotice(null);
        }
      } finally {
        if (!isCancelled && currentId === id) {
          console.log(`[NoticeDetail] 로딩 종료`);
          setLoading(false);
        }
        if (requestRef.current === promise) {
          requestRef.current = null;
        }
      }
    }

    fetchNotice();

    // cleanup 함수: id가 변경되거나 컴포넌트가 unmount될 때 호출
    return () => {
      isCancelled = true;
      if (requestRef.current) {
        console.log('[NoticeDetail] cleanup: 요청 취소');
        requestRef.current.cancel();
        requestRef.current = null;
      }
    };
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
