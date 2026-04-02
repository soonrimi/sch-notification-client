'use client';

import React, { useState, useRef, useLayoutEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import Stack from '@mui/material/Stack';
import type { CategoryItem } from '@/contexts/CategoryContext';
import type { Major } from '@/types/profile';

interface HomeHeaderCategorysProps {
  category: CategoryItem;
  setCategory: React.Dispatch<React.SetStateAction<CategoryItem>>;
  categories: CategoryItem[];
  majors: Major[];
  onHeightChange?: (height: number) => void;
  onDepartmentPanelChange?: (open: boolean) => void;
}

export default function HomeHeaderCategorys({
  category,
  setCategory,
  categories,
  majors,
  onHeightChange,
  onDepartmentPanelChange,
}: HomeHeaderCategorysProps) {
  const router = useRouter();
  const [showDepartments, setShowDepartments] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null
  );
  const containerRef = useRef<HTMLDivElement>(null);

  const userDepartments = Array.from(new Set(majors.map((m) => m.name)));

  useLayoutEffect(() => {
    if (containerRef.current && onHeightChange) {
      onHeightChange(containerRef.current.offsetHeight);
    }
  }, [showDepartments, onHeightChange]);

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

  const handleCategoryClick = (item: CategoryItem) => {
    setCategory(item);
    if (item.name === '학과') {
      if (userDepartments.length > 1) {
        const next = !showDepartments;
        setShowDepartments(next);
        onDepartmentPanelChange?.(next);
      }
    } else {
      setShowDepartments(false);
      onDepartmentPanelChange?.(false);
    }
  };

  const handleDepartmentClick = (dept: string) => {
    setSelectedDepartment(dept);
  };

  return (
    <Stack
      ref={containerRef}
      direction="column"
      sx={{
        position: 'fixed',
        top: '45px',
        left: 0,
        right: 0,
        zIndex: 999,
        backgroundColor: '#fff',
        overflowX: 'auto',
        padding: '5px 20px 5px 16px',
        WebkitOverflowScrolling: 'touch',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{
          flexWrap: 'nowrap',
        }}
      >
        {categories
          .filter((item) => item.visible)
          .map((item) => (
            <Button
              key={item.id}
              variant={category.id === item.id ? 'contained' : 'outlined'}
              onClick={() => handleCategoryClick(item)}
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

      {showDepartments && (
        <Stack
          direction="row"
          spacing={1}
          sx={{
            marginTop: 1,
            overflowX: 'auto',
            flexWrap: 'nowrap',
            WebkitOverflowScrolling: 'touch',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          <Button
            key="전체"
            variant={selectedDepartment === '전체' ? 'contained' : 'outlined'}
            onClick={() => handleDepartmentClick('전체')}
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
              ...getButtonStyles(
                { id: '전체', name: '전체' } as CategoryItem,
                selectedDepartment === '전체'
              ),
            }}
          >
            전체
          </Button>
          {userDepartments.map((dept) => (
            <Button
              key={dept}
              variant={selectedDepartment === dept ? 'contained' : 'outlined'}
              onClick={() => handleDepartmentClick(dept)}
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
                ...getButtonStyles(
                  { id: dept, name: dept } as CategoryItem,
                  selectedDepartment === dept
                ),
              }}
            >
              {dept}
            </Button>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
