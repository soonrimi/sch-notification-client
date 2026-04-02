'use client';

import React, { useState, useRef, useLayoutEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import Stack from '@mui/material/Stack';
import type { CategoryItem } from '@/contexts/CategoryContext';
import type { Major } from '@/types/profile';
import styles from './HomeHeaderCategorys.module.css';

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
  const departmentSliderRef = useRef<HTMLDivElement>(null);
  const departmentTabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const userDepartments = Array.from(new Set(majors.map((m) => m.name)));

  useLayoutEffect(() => {
    if (containerRef.current && onHeightChange) {
      onHeightChange(containerRef.current.offsetHeight);
    }
  }, [showDepartments, onHeightChange]);

  useLayoutEffect(() => {
    if (showDepartments && departmentSliderRef.current && departmentTabsRef.current) {
      const allDepts = ['전체', ...userDepartments];
      const activeIndex = allDepts.findIndex((dept) => dept === selectedDepartment);
      const activeButton = departmentTabsRef.current[activeIndex];

      if (activeButton) {
        const buttonRect = activeButton.getBoundingClientRect();
        const containerRect = departmentSliderRef.current.getBoundingClientRect();

        const left = buttonRect.left - containerRect.left;
        const width = buttonRect.width;

        const indicator = departmentSliderRef.current.querySelector(
          `.${styles.slider_indicator}`
        ) as HTMLElement;
        if (indicator) {
          indicator.style.transform = `translateX(${left}px)`;
          indicator.style.width = `${width}px`;
        }
      }
    }
  }, [selectedDepartment, showDepartments, userDepartments]);

  const handleCategoryClick = (item: CategoryItem) => {
    setCategory(item);
    if (item.name === '학과') {
      if (userDepartments.length > 1) {
        const next = !showDepartments;
        setShowDepartments(next);
        if (next) {
          setSelectedDepartment('전체');
        }
        onDepartmentPanelChange?.(next);
      }
    } else {
      setShowDepartments(false);
      setSelectedDepartment(null);
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
                  backgroundColor: '#fff',
                  color: '#000',
                },
                '&.MuiButton-contained': {
                  border: 'none',
                  backgroundColor: '#3182F6',
                  color: '#fff',
                },
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
        <div
          ref={departmentSliderRef}
          className={styles.slider_track}
          style={{
            marginTop: 8,
            overflow: 'auto',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <div className={styles.slider_indicator} />
          <button
            ref={(el) => {
              departmentTabsRef.current[0] = el;
            }}
            className={`${styles.slider_tab} ${
              selectedDepartment === '전체' ? styles.slider_tab_active : ''
            }`}
            onClick={() => handleDepartmentClick('전체')}
          >
            전체
          </button>
          {userDepartments.map((dept, index) => (
            <button
              key={dept}
              ref={(el) => {
                departmentTabsRef.current[index + 1] = el;
              }}
              className={`${styles.slider_tab} ${
                selectedDepartment === dept ? styles.slider_tab_active : ''
              }`}
              onClick={() => handleDepartmentClick(dept)}
            >
              {dept}
            </button>
          ))}
        </div>
      )}
    </Stack>
  );
}
