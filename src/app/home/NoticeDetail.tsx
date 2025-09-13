'use client';
import React, { useEffect } from 'react';
import Layout from '@/Components/LayoutDir/Layout';
import {
  Box,
  Typography,
  Stack,
  Button,
  IconButton,
  colors,
} from '@mui/material';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import { useBookmark } from '@/hooks/useBookmark';
import { useNotices } from '@/hooks/useNotices';
import { CategoryItem, useCategories } from '@/contexts/CategoryContext';
import { CATEGORY_COLORS, getCategoryName } from '@/constants/categories';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

interface NoticeDetailProps {
  id: string;
}

export default function NoticeDetail({ id }: NoticeDetailProps) {
  // 전체 카테고리 객체
  const allCategory: CategoryItem = {
    id: '0',
    name: getCategoryName('ALL'),
    color: CATEGORY_COLORS['ALL'],
    notify: false,
    visible: true,
  };

  // 전체 공지 가져오기
  const notices = useNotices({
    id: Number(allCategory.id),
    name: allCategory.name,
  });

  // id로 공지 찾기
  const notice = notices.find((n) => n.id === decodeURIComponent(id));
  const { bookmarked, toggleBookmark } = useBookmark(notice?.id || '');

  // 읽음 처리
  useEffect(() => {
    if (!notice) return;

    const readNotices: string[] = JSON.parse(
      localStorage.getItem('readNotices') || '[]'
    );

    if (!readNotices.includes(notice.id)) {
      readNotices.push(notice.id);
      localStorage.setItem('readNotices', JSON.stringify(readNotices));
    }
  }, [notice]);

  if (!notice)
    return <Layout hideBottomNav>해당 공지를 찾을 수 없습니다.</Layout>;

  // 첨부파일 예시
  const attachments = [
    {
      name: '개인정보수집이용동의서.hwp',
      url: '/files/개인정보수집이용동의서.hwp',
    },
    { name: '이력서 양식_1.hwp', url: '/files/이력서양식.hwp' },
    { name: '이력서 양식_2.hwp', url: '/files/이력서양식.hwp' },
    { name: '이력서 양식_3.hwp', url: '/files/이력서양식.hwp' },
  ];

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
      headerProps={{
        pageType: 'contentdetail',
        noticeHeaderProps: {
          category: notice.category,
          noticeId: notice.id,
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
                      fontSize: '13px',
                    }}
                  >
                    {file.name}
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

          {/* 텍스트 박스 */}
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
              {notice.upload_time.toISOString().slice(0, 10)}
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
          <span>조회수 37회</span>
        </Typography>

        <Typography
          variant="body2"
          whiteSpace="pre-line"
          mb={3}
          mt={3}
          fontSize="15px"
        >
          {notice.detail}
        </Typography>
      </Box>
    </Layout>
  );
}
