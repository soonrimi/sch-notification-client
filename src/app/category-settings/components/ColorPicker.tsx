'use client';
import React from 'react';
import { Box, IconButton, Popover } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import { PALETTE_COLORS } from '@/constants/CategoryColorPalette';
import styles from '../page.module.css';

type Props = {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onSelect: (color: string) => void;
};

export default function ColorPicker({ anchorEl, onClose, onSelect }: Props) {
  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      PaperProps={{ sx: { zIndex: 1500, borderRadius: '1rem' } }}
    >
      <Box className={styles.colorPicker}>
        {Object.values(PALETTE_COLORS).map((color) => (
          <IconButton
            key={color}
            onClick={() => onSelect(color)}
            className={styles.colorBtn}
          >
            <CircleIcon sx={{ color }} />
          </IconButton>
        ))}
      </Box>
    </Popover>
  );
}
