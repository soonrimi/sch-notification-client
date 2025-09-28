<AttachmentDrawer 
        anchor="bottom"
        open={openModal}
        onClose={() => setOpenModal(false)}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            height: '40vh', // 원하는 높이
          },
        }}
      >
        {/* Swipe 감지를 위한 div */}
        <div {...handlers}>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              py: 1,
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 4,
                bgcolor: 'grey.400',
                borderRadius: 2,
              }}
            />
          </Box>

          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="h6" mb={2}>
              첨부파일
            </Typography>
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
        </div>
      </AttachmentDrawer >