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
        placeholder="검색어를 입력하세요."
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
          backgroundColor: '#F9FAFB',
          borderRadius: '0.625rem',
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
          '& .MuiOutlinedInput-root': {
            height: '2.2rem',
            fontSize: '0.875rem',
            padding: '0 0.5rem',
          },
          '& .MuiInputBase-input': {
            fontSize: '0.875rem',
          },
          '& .MuiInputBase-input::placeholder': {
            fontSize: '0.8125rem',
            color: '#9CA3AF',
          },
        }}
        InputProps={{
          endAdornment: searchKeyword && (
            <IconButton
              size="small"
              onClick={() => setSearchKeyword('')}
              sx={{ p: '0.25rem' }}
            >
              <ClearIcon
                onClick={() => {
                  if (disableInput) {
                    onBack();
                  }
                }}
                sx={{ fontSize: '1rem', color: '#606060' }}
              />
            </IconButton>
          ),
        }}
      />
    </div>
  );
}
