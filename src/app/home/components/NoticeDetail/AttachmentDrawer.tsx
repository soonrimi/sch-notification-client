'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  Drawer,
  IconButton,
  Button,
} from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useSwipeable } from 'react-swipeable';
import { FileButton } from './FileButton';
import type { Attachment } from './types';
import { downloadAll } from './downloadFile';

interface Props {
  attachments: Attachment[];
}

export function AttachmentDrawer({ attachments }: Props) {
  const [openAttachmentDrawer, setOpenAttachmentDrawer] = useState(false);

  const handleClose = () => {
    setOpenAttachmentDrawer(false);
    // 강제 리페인트
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 0);
  };

  const handlers = useSwipeable({
    onSwipedDown: () => {
      handleClose();
    },
    delta: 50,
    trackTouch: true,
    trackMouse: false,
  });

  return (
    <>
      {/* IconButton을 항상 표시하되, Drawer가 열릴 때만 숨김 */}
      {attachments.length > 0 && !openAttachmentDrawer && (
        <IconButton
          key={`fab-${openAttachmentDrawer}`}
          onClick={() => setOpenAttachmentDrawer(true)}
          sx={{
            position: 'fixed',
            bottom: '1.1675rem',
            right: '1rem',
            bgcolor: '#3182F7',
            width: '3.1rem',
            height: '3.1rem',
            borderRadius: '30%',
            zIndex: 1400, // Drawer보다 높게
            boxShadow: '0 4px 12px rgba(49, 130, 247, 0.4)',
            '&:hover': {
              bgcolor: '#2868CC',
            },
          }}
        >
          <ArrowDownwardIcon
            sx={{
              fontSize: '1.8125rem',
              color: '#fff',
            }}
          />
        </IconButton>
      )}

      {/* 첨부파일 모달 */}
      <Drawer
        anchor="bottom"
        open={openAttachmentDrawer}
        onClose={handleClose}
        slotProps={{
          backdrop: {
            onClick: handleClose,
            sx: {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        }}
        PaperProps={{
          sx: {
            margin: 1.4,
            borderRadius: 6,
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1300,
          },
        }}
        disableEnforceFocus
        disableRestoreFocus
        keepMounted={false}
      >
        <Box
          {...handlers}
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            touchAction: 'pan-y',
          }}
        >
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              py: 1.2,
              cursor: 'grab',
              '&:active': {
                cursor: 'grabbing',
              },
            }}
          >
            <Box
              sx={{
                width: 45,
                height: 4,
                bgcolor: 'grey.300',
                borderRadius: 2,
              }}
            />
          </Box>

          <Box sx={{ px: 3, pb: 2 }}>
            <Typography
              fontSize={'1.0625rem'}
              sx={{ color: '#4E555F', fontWeight: '550' }}
            >
              첨부파일
            </Typography>
          </Box>

          <Box sx={{ flex: 1, px: 3, overflow: 'auto', maxHeight: '75vh' }}>
            {attachments.length ? (
              <Stack spacing={1.5}>
                {attachments.map((file, idx) => (
                  <FileButton key={idx} file={file} />
                ))}
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">
                첨부파일이 없습니다.
              </Typography>
            )}
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '1rem',
              pb: 2,
              pt: 3,
              px: 3,
              bgcolor: 'white',
            }}
          >
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#E9EAEC',
                color: '#4E555F',
                borderRadius: '11px',
                minWidth: '160px',
                minHeight: '50px',
                fontSize: '17px',
                fontWeight: '400',
              }}
              onClick={handleClose}
            >
              닫기
            </Button>
            {attachments.length > 0 && (
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#3182F7',
                  color: 'white',
                  borderRadius: '11px',
                  minWidth: '160px',
                  minHeight: '50px',
                  fontSize: '17px',
                  fontWeight: '400',
                }}
                onClick={() => downloadAll(attachments)}
              >
                전체 다운로드
              </Button>
            )}
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
