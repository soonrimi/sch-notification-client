'use client';

import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { allNotices } from '@/mock/notices';
import Layout from '@/Components/LayoutDir/Layout';
import { Box, Typography, Stack, Button, IconButton } from '@mui/material';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import { useBookmark } from '@/hooks/useBookmark';

export default function NoticeDetailPage() {
  const { id } = useParams();
  const notice = allNotices.find(
    (n) => n.id === decodeURIComponent(id as string)
  );

  const { bookmarked, toggleBookmark } = useBookmark(notice?.id || '');

  // 읽음 처리
  useEffect(() => {
    if (!notice) return;
    const readNotices = JSON.parse(localStorage.getItem('readNotices') || '[]');
    if (!readNotices.includes(notice.id)) {
      readNotices.push(notice.id);
      localStorage.setItem('readNotices', JSON.stringify(readNotices));
    }
  }, [notice]);

  if (!notice) return <Layout>해당 공지를 찾을 수 없습니다.</Layout>;

  // 첨부파일 리스트 (임시 데이터)
  const attachments = [
    {
      name: '개인정보수집이용동의서.hwp',
      url: '/files/개인정보수집이용동의서.hwp',
    },
    { name: '이력서 양식_1.hwp', url: '/files/이력서양식.hwp' },
    { name: '이력서 양식_2.hwp', url: '/files/이력서양식.hwp' },
    { name: '이력서 양식_3.hwp', url: '/files/이력서양식.hwp' },
  ];

  // 모든 첨부파일 다운로드
  const handleDownloadAll = () => {
    attachments.forEach((file) => {
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      link.click();
    });
  };

  return (
    <Layout
      pageType="notice"
      noticeHeaderProps={{
        category: notice.category,
        noticeId: notice.id,
        isBookmarked: bookmarked,
        onToggleBookmark: toggleBookmark,
      }}
      hideBottomNav={true}
    >
      {/* 본문 */}
      <Box sx={{ p: 3 }}>
        <Typography variant="subtitle1" fontWeight={'bold'} mb={1}>
          {notice.title}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          mb={1}
          display="block"
          fontSize={'12px'}
        >
          작성자: 국제교육교류처 | 등록일: 2025-08-01 | 조회수: 37
        </Typography>
        <hr
          style={{
            border: '1px solid #acacacff',
            transform: 'scaleY(0.1)',
            marginBottom: '20px',
            width: '100vw',
            marginLeft: '-50vw',
            position: 'relative',
            left: '50%',
            right: '50%',
          }}
        />
        <Typography
          variant="body2"
          whiteSpace="pre-line"
          mb={3}
          fontSize={'14px'}
        >
          {notice.detail}
        </Typography>
      </Box>

      {/* 첨부파일 영역 */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 1,
          bottom: 0,
          bgcolor: 'white',
          height: 40,
          zIndex: 1000,
          left: 0,
          width: '100%',
          position: 'fixed',
        }}
      >
        {/* 첨부파일 리스트 */}
        <Box
          sx={{
            flex: 9,
            overflowX: 'auto',
            scrollbarWidth: 'none', // Firefox
            '&::-webkit-scrollbar': {
              display: 'none', // Chrome, Safari, Edge
            },
          }}
        >
          <Stack direction="row" spacing={1.1} alignItems="center">
            {attachments.map((file, idx) => (
              <Button
                key={idx}
                variant="outlined"
                sx={{
                  height: 24,
                  width: 'auto',
                  maxWidth: 160,
                  px: 1,
                  borderRadius: '20px',
                  borderColor: '#aaa',
                  color: 'black',
                  fontSize: '14px',
                  bgcolor: 'white',
                  flexShrink: 0,
                }}
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = file.url;
                  link.download = file.name;
                  link.click();
                }}
              >
                <Box
                  sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontSize: '10px',
                  }}
                >
                  {file.name}
                </Box>
              </Button>
            ))}
          </Stack>
        </Box>

        {/* 전체 다운로드 버튼 */}
        <Box sx={{ flex: 1, textAlign: 'center' }}>
          <IconButton onClick={handleDownloadAll} sx={{ bgcolor: 'white' }}>
            <SystemUpdateAltIcon
              sx={{ fontSize: 22, color: '#626262ff', marginRight: -1.5 }}
            />
          </IconButton>
        </Box>
      </Box>
    </Layout>
  );
}
