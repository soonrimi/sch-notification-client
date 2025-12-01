'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import Stack from '@mui/material/Stack';
import type { CategoryItem } from '@/contexts/CategoryContext';

interface HomeHeaderCategorysProps {
  category: CategoryItem;
  setCategory: React.Dispatch<React.SetStateAction<CategoryItem>>;
  categories: CategoryItem[];
}

export default function HomeHeaderCategorys({
  category,
  setCategory,
  categories,
}: HomeHeaderCategorysProps) {
  const router = useRouter();

  function getButtonStyles(item: CategoryItem, selected: boolean) {
    return selected
      ? {
          border: 'none',
          backgroundColor: '#3182F6',
          color: '#fff',
        }
      : {
          border: 'none',
          backgroundColor: '#fff',
          color: '#000',
        };
  }

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        position: 'fixed',
        top: '45px',
        left: 0,
        right: 0,
        zIndex: 999,
        backgroundColor: '#fff',
        overflowX: 'auto',
        flexWrap: 'nowrap',
        padding: '5px 20px 5px 16px',
        WebkitOverflowScrolling: 'touch',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      {categories
        .filter((item) => item.visible)
        .map((item) => (
          <Button
            key={item.id}
            variant={category.id === item.id ? 'contained' : 'outlined'}
            onClick={() => setCategory(item)}
            sx={{
              minWidth: 0,
              padding: '0 12px',
              height: 32,
              borderRadius: '8px',
              fontSize: 15,
              fontWeight: 400,
              flexShrink: 0,
              textTransform: 'none',
              justifyContent: 'center',
              alignItems: 'center',
              '&.MuiButton-outlined': {
                border: 'none',
              },
              '&.MuiButton-contained': {
                border: 'none',
              },
              ...getButtonStyles(item, category.id === item.id),
            }}
            aria-pressed={category.id === item.id}
          >
            {item.name}
          </Button>
        ))}

      {/* 설정 버튼 */}
      <Button
        onClick={() => router.push('/category-settings')}
        sx={{
          minWidth: 50,
          height: 32,
          borderRadius: '8px',
          padding: '6px 0 0 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        <EditIcon sx={{ fontSize: 22, color: '#525252ff' }} />
      </Button>
    </Stack>
  );
}
