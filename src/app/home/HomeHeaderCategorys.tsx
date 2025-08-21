'use client';
import React from 'react';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import Stack from '@mui/material/Stack';
import { categories, categoryColors, Category } from '@/constants/categories';

interface HomeHeaderCategorysProps {
  category: Category;
  setCategory: (cat: Category) => void;
}

function getButtonStyles(cat: Category, selected: boolean) {
  return selected
    ? {
        border: `1px solid ${categoryColors[cat]}`,
        backgroundColor: categoryColors[cat],
        color: '#fff',
      }
    : { border: '1px solid #6b6b6b', backgroundColor: '#fff', color: '#000' };
}

export default function HomeHeaderCategorys({
  category,
  setCategory,
}: HomeHeaderCategorysProps) {
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
      {categories.map((cat) => (
        <Button
          key={cat}
          variant={category === cat ? 'contained' : 'outlined'}
          onClick={() => setCategory(cat)}
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
            ...getButtonStyles(cat, category === cat),
          }}
          aria-pressed={category === cat}
        >
          {cat}
        </Button>
      ))}
      <Button
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
