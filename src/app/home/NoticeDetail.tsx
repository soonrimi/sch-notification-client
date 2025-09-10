// 'use client';
// import React, { useEffect } from 'react';
// import { allNotices } from '@/mock/notices';
// import Layout from '@/Components/LayoutDir/Layout';
// import { Box, Typography, Stack, Button, IconButton } from '@mui/material';
// import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
// import { useBookmark } from '@/hooks/useBookmark';

// interface NoticeDetailProps {
//   id: string;
// }

// export default function NoticeDetail({ id }: NoticeDetailProps) {
//   const notice = allNotices.find((n) => n.id === decodeURIComponent(id));
//   const { bookmarked, toggleBookmark } = useBookmark(notice?.id || '');

//   useEffect(() => {
//     if (!notice) return;
//     const readNotices = JSON.parse(localStorage.getItem('readNotices') || '[]');
//     if (!readNotices.includes(notice.id)) {
//       readNotices.push(notice.id);
//       localStorage.setItem('readNotices', JSON.stringify(readNotices));
//     }
//   }, [notice]);

//   if (!notice)
//     return <Layout hideBottomNav>해당 공지를 찾을 수 없습니다.</Layout>;

//   const attachments = [
//     {
//       name: '개인정보수집이용동의서.hwp',
//       url: '/files/개인정보수집이용동의서.hwp',
//     },
//     { name: '이력서 양식_1.hwp', url: '/files/이력서양식.hwp' },
//     { name: '이력서 양식_2.hwp', url: '/files/이력서양식.hwp' },
//     { name: '이력서 양식_3.hwp', url: '/files/이력서양식.hwp' },
//   ];

//   const handleDownloadAll = () => {
//     attachments.forEach((file) => {
//       const link = document.createElement('a');
//       link.href = file.url;
//       link.download = file.name;
//       link.click();
//     });
//   };

//   return (
//     <Layout
//       headerProps={{
//         pageType: 'contentdetail',
//         noticeHeaderProps: {
//           category: notice.category,
//           noticeId: notice.id,
//           isBookmarked: bookmarked,
//           onToggleBookmark: toggleBookmark,
//         },
//       }}
//       hideBottomNav
//       footerSlot={
//         <Box
//           sx={{
//             display: 'flex',
//             alignItems: 'center',
//             p: 1,
//             bgcolor: 'white',
//             height: 48,
//           }}
//         >
//           <Box
//             sx={{
//               flex: 9,
//               overflowX: 'auto',
//               scrollbarWidth: 'none',
//               '&::-webkit-scrollbar': { display: 'none' },
//             }}
//           >
//             <Stack direction="row" spacing={1.1} alignItems="center">
//               {attachments.map((file, idx) => (
//                 <Button
//                   key={idx}
//                   variant="outlined"
//                   sx={{
//                     height: 25,
//                     width: 'auto',
//                     maxWidth: 160,
//                     px: 1,
//                     borderRadius: '20px',
//                     borderColor: '#aaa',
//                     color: 'black',
//                     bgcolor: 'white',
//                     flexShrink: 0,
//                   }}
//                   onClick={() => {
//                     const link = document.createElement('a');
//                     link.href = file.url;
//                     link.download = file.name;
//                     link.click();
//                   }}
//                 >
//                   <Box
//                     sx={{
//                       whiteSpace: 'nowrap',
//                       overflow: 'hidden',
//                       textOverflow: 'ellipsis',
//                       fontSize: '12px',
//                     }}
//                   >
//                     {file.name}
//                   </Box>
//                 </Button>
//               ))}
//             </Stack>
//           </Box>

//           <Box sx={{ flex: 1, textAlign: 'center' }}>
//             <IconButton onClick={handleDownloadAll} sx={{ bgcolor: 'white' }}>
//               <SystemUpdateAltIcon
//                 sx={{ fontSize: 22, color: '#626262ff', marginRight: -1.5 }}
//               />
//             </IconButton>
//           </Box>
//         </Box>
//       }
//     >
//       {/* 본문 */}
//       <Box sx={{ p: 3 }}>
//         <Typography variant="subtitle1" fontWeight="bold" fontSize={19} mb={1}>
//           {notice.title}
//         </Typography>
//         <Typography
//           variant="caption"
//           color="text.secondary"
//           mb={1}
//           display="block"
//           fontSize="12px"
//         >
//           작성자: 국제교육교류처 | 등록일: 2025-08-01 | 조회수: 37
//         </Typography>
//         <hr
//           style={{
//             border: '1px solid #acacacff',
//             transform: 'scaleY(0.1)',
//             marginBottom: 20,
//             width: '100vw',
//             marginLeft: '-50vw',
//             position: 'relative',
//             left: '50%',
//             right: '50%',
//           }}
//         />
//         <Typography
//           variant="body2"
//           whiteSpace="pre-line"
//           mb={3}
//           fontSize="15px"
//         >
//           {notice.detail}
//         </Typography>
//       </Box>
//     </Layout>
//   );
// }
'use client';
import React, { useEffect } from 'react';
import Layout from '@/Components/LayoutDir/Layout';
import { Box, Typography, Stack, Button, IconButton } from '@mui/material';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import { useBookmark } from '@/hooks/useBookmark';
import { useNotices } from '@/hooks/useNotices';
import { CategoryItem, useCategories } from '@/contexts/CategoryContext';
import { categoryColors } from '@/constants/categories';

interface NoticeDetailProps {
  id: string;
}

export default function NoticeDetail({ id }: NoticeDetailProps) {
  // 전체 카테고리 객체
  const allCategory: CategoryItem = {
  id: '0',
  name: '전체',
  color: categoryColors['전체'],
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
                    height: 25,
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
                      fontSize: '12px',
                    }}
                  >
                    {file.name}
                  </Box>
                </Button>
              ))}
            </Stack>
          </Box>
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <IconButton onClick={handleDownloadAll} sx={{ bgcolor: 'white' }}>
              <SystemUpdateAltIcon
                sx={{ fontSize: 22, color: '#626262ff', marginRight: -1.5 }}
              />
            </IconButton>
          </Box>
        </Box>
      }
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" fontSize={19} mb={1}>
          {notice.title}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          mb={1}
          display="block"
          fontSize="12px"
        >
          작성자: 국제교육교류처 | 등록일:{' '}
          {notice.upload_time.toISOString().slice(0, 10)} | 조회수: 37
        </Typography>
        <hr
          style={{
            border: '1px solid #acacacff',
            transform: 'scaleY(0.1)',
            marginBottom: 20,
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
          fontSize="15px"
        >
          {notice.detail}
        </Typography>
      </Box>
    </Layout>
  );
}
