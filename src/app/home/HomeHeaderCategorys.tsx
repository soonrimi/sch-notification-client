'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import Stack from '@mui/material/Stack';
import { useCategories, CategoryItem } from '@/contexts/CategoryContext';

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
          border: `1px solid ${item.color}`,
          backgroundColor: item.color,
          color: '#fff',
        }
      : {
          border: '1px solid #6b6b6b',
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
              borderRadius: '9999px',
              fontSize: 15,
              flexShrink: 0,
              textTransform: 'none',
              justifyContent: 'center',
              alignItems: 'center',
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
          borderRadius: '9999px',
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
