'use client';

import React, { useEffect, useState, useRef } from 'react';
import Layout from '@/Components/LayoutDir/Layout';
import { Box, Typography } from '@mui/material';
import { CrawlPostControllerService } from '@/api/services/CrawlPostControllerService';
import type { DetailResponse } from '@/api/models/DetailResponse';
import { useBookmark } from '@/hooks/useBookmark';
import { Category } from '@/constants/categories';
import { formatAbsoluteDate } from '@/utils/NoticeDate';
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
  const [shareUrl, setShareUrl] = useState<string>('');

  useEffect(() => {
    let isCancelled = false;
    const currentId = id;

    async function fetchNotice() {
      // 이전 요청 취소
      if (requestRef.current) {
        console.log('[NoticeDetail] 이전 요청 취소');
        requestRef.current.cancel();
        requestRef.current = null;
      }

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

        if (
          !isCancelled &&
          currentId === id &&
          requestRef.current === promise
        ) {
          setNotice({
            ...data,
            upload_time: data.createdAt ? new Date(data.createdAt) : null,
          });
        } else {
          console.log(
            `[NoticeDetail] 상태 업데이트 취소됨 - isCancelled: ${isCancelled}, currentId: ${currentId}, id: ${id}, requestRef: ${
              requestRef.current === promise
            }`
          );
        }
      } catch (err: unknown) {
        if (
          err instanceof Error &&
          (err.name === 'CancelError' ||
            (err as { isCancelled?: boolean }).isCancelled)
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
          console.log('[NoticeDetail] 로딩 종료');
          setLoading(false);
        }
        if (requestRef.current === promise) {
          requestRef.current = null;
        }
      }
    }

    fetchNotice();

    return () => {
      isCancelled = true;
      if (requestRef.current) {
        console.log('[NoticeDetail] cleanup: 요청 취소');
        requestRef.current.cancel();
        requestRef.current = null;
      }
    };
  }, [id]);

  // 공유용 URL (현재 오리진 기준 /home?id=...)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const origin = window.location.origin;
    setShareUrl(`${origin}/home?id=${id}`);
  }, [id]);

  if (loading) return <Layout hideBottomNav>로딩중...</Layout>;
  if (!notice)
    return <Layout hideBottomNav>해당 공지를 찾을 수 없습니다.</Layout>;

  const attachments: Attachment[] = (notice?.attachments ?? []).map((att) => ({
    fileName: att.fileName,
    fileUrl: att.fileUrl,
  }));

  const imageExtensions = [
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.webp',
    '.bmp',
    '.svg',
  ];
  const attachmentImage =
    notice.attachments?.find((att) => {
      if (!att.fileName || !att.fileUrl) return false;
      const ext = att.fileName
        .toLowerCase()
        .substring(att.fileName.lastIndexOf('.'));
      return imageExtensions.includes(ext);
    })?.fileUrl || null;

  const contentImage =
    notice.contentImages && notice.contentImages.length > 0
      ? notice.contentImages[0]
      : null;

  const description = notice.content
    ? notice.content.replace(/<[^>]*>/g, '').substring(0, 100) + '...'
    : '순천향대학교 공지사항을 확인해보세요.';

  const shareInfo = {
    title: notice.title ?? '순천향대학교 공지사항',
    description,
    imageUrl: contentImage || attachmentImage || undefined,
    url:
      shareUrl || (typeof window !== 'undefined' ? window.location.href : ''),
  };

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
            shareInfo,
          },
        }}
        hideBottomNav
      >
        <div
          style={{
            flex: '1 1 auto',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            height: '100%',
            minHeight: 0,
          }}
        >
          <Box sx={{ p: '10px 23px', pb: attachments.length > 0 ? '5rem' : 3 }}>
            <Typography
              variant="subtitle1"
              fontWeight="600"
              fontSize={17}
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
              <span>{formatAbsoluteDate(notice.upload_time) ?? ''}</span>
              <span>조회수 {notice.viewCount ?? 0}회</span>
            </Typography>
            <hr
              style={{
                width: 'calc(100% + 48px)',
                marginLeft: '-24px',
                marginRight: '-24px',
                border: 'none',
                borderTop: '1px solid #242424',
                transform: 'scaleY(0.2)',
                marginTop: '0.1875rem',
                marginBottom: 0,
                padding: 0,
              }}
            />
            <Typography
              variant="body2"
              sx={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                lineHeight: 1.8,
                fontSize: '15px',
                color: '#333',
                mb: 3,
                mt: 3.8,
                '& p': {
                  marginBottom: '1em',
                  marginTop: 0,
                },
                '& br': {
                  display: 'block',
                  content: '""',
                  marginTop: '0.5em',
                },
              }}
              dangerouslySetInnerHTML={{ __html: notice.content ?? '' }}
            />
            {notice.contentImages && notice.contentImages.length > 0 && (
              <Box sx={{ mt: 2, mb: 2 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '14px',
                    color: '#666',
                    mb: 1,
                  }}
                >
                  이미지가 표시되지 않는 경우:
                </Typography>
                {notice.contentImages.map((imageUrl, index) => {
                  const imageCount = notice.contentImages?.length ?? 0;
                  return (
                    <Box key={index} sx={{ mb: 1 }}>
                      <Typography
                        component="a"
                        href={imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          display: 'inline-block',
                          padding: '8px 16px',
                          backgroundColor: '#f5f5f5',
                          color: '#333',
                          textDecoration: 'none',
                          borderRadius: '4px',
                          fontSize: '14px',
                          border: '1px solid #ddd',
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: '#e8e8e8',
                          },
                        }}
                      >
                        원본 URL 보러가기
                        {imageCount > 1 ? ` (${index + 1})` : ''}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            )}
          </Box>
        </div>
      </Layout>

      {attachments.length > 0 && <AttachmentDrawer attachments={attachments} />}
    </>
  );
}
