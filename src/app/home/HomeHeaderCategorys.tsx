'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import Stack from '@mui/material/Stack';
import { useCategories } from '@/contexts/CategoryContext';
import { useCategoryColors } from '@/contexts/CategoryColorContext';

interface HomeHeaderCategorysProps {
  category: string;
  setCategory: (cat: string) => void;
}

export default function HomeHeaderCategorys({
  category,
  setCategory,
}: HomeHeaderCategorysProps) {
  const router = useRouter();
  const { items } = useCategories();
  const { categoryColors } = useCategoryColors();

  function getButtonStyles(catName: string, selected: boolean) {
    return selected
      ? {
          border: `1px solid ${categoryColors[catName]}`,
          backgroundColor: categoryColors[catName],
          color: '#fff',
        }
      : { border: '1px solid #6b6b6b', backgroundColor: '#fff', color: '#000' };
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
      {items.map((item) =>
        item.name === '전체' || item.visible ? ( // ✅ "전체"는 항상 보이게
          <Button
            key={item.id}
            variant={category === item.name ? 'contained' : 'outlined'}
            onClick={() => setCategory(item.name)}
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
              ...getButtonStyles(item.name, category === item.name),
            }}
            aria-pressed={category === item.name}
          >
            {item.name}
          </Button>
        ) : null
      )}

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
