'use client';

import { Button, Typography } from '@mui/material';
import { getFileIcon } from './fileIcons';
import type { Attachment } from './types';
import { downloadFile } from './downloadFile';

export function FileButton({ file }: { file: Attachment }) {
  return (
    <Button
      variant="outlined"
      sx={{
        justifyContent: 'flex-start',
        gap: 1,
        color: 'black',
        borderColor: '#9f9f9fff',
      }}
      onClick={() => {
        downloadFile(file);
      }}
    >
      {getFileIcon(file.fileName ?? '')}
      <Typography
        sx={{
          textAlign: 'left',
          fontSize: '14px',
        }}
      >
        {file.fileName}
      </Typography>
    </Button>
  );
}
