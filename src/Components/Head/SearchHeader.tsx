'use client';
import React, { useEffect, useRef } from 'react';
import styles from './Header.module.css';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { IconButton, TextField } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

interface SearchHeaderProps {
  searchKeyword: string;
  setSearchKeyword: (val: string) => void;
  onBack: () => void;
  onSearch?: (keyword: string) => void;
  disableInput?: boolean;
}

export default function SearchHeader({
  searchKeyword,
  setSearchKeyword,
  onBack,
  onSearch,
  disableInput = false,
}: SearchHeaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // /search 페이지에서만 자동 focus
  useEffect(() => {
    if (!disableInput) {
      inputRef.current?.focus();
    }
  }, [disableInput]);

  return (
    <div className={styles.header_wrapper}>
      <IconButton onClick={onBack}>
        <ArrowBackIosIcon fontSize="small" sx={{ color: '#333333' }} />
      </IconButton>
      <TextField
        inputRef={inputRef}
        placeholder="제목, 내용"
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && onSearch) {
            onSearch(searchKeyword);
          }
        }}
        onClick={() => {
          if (disableInput) {
            onBack();
          }
        }}
        variant="outlined"
        size="small"
        fullWidth
        sx={{
          backgroundColor: '#e0e0e0ff',
          borderRadius: '10px',
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
          '& .MuiOutlinedInput-root': {
            height: 36,
          },
        }}
        InputProps={{
          endAdornment: searchKeyword && (
            <IconButton
              size="small"
              onClick={() => setSearchKeyword('')}
              sx={{ p: 0.5 }}
            >
              <ClearIcon
                onClick={() => {
                  if (disableInput) {
                    onBack();
                  }
                }}
                sx={{ fontSize: 18, color: '#606060ff' }}
              />
            </IconButton>
          ),
        }}
      />
    </div>
  );
}
