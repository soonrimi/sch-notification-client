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
  const [showSubItems, setShowSubItems] = useState(false);
  const [selectedSubItem, setSelectedSubItem] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const subItemSliderRef = useRef<HTMLDivElement>(null);
  const subItemTabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const userDepartments = Array.from(new Set(majors.map((m) => m.name)));
  const userGradeLabels = Array.from(
    new Set(majors.map((m) => `${m.name} ${m.grade}`))
  );

  const getSubItems = (item: CategoryItem) => {
    if (item.name === '학과') return userDepartments;
    if (item.name === '학년') return userGradeLabels;
    return [];
  };

  useLayoutEffect(() => {
    if (containerRef.current && onHeightChange) {
      onHeightChange(containerRef.current.offsetHeight);
    }
  }, [showSubItems, onHeightChange]);

  useLayoutEffect(() => {
    if (showSubItems && subItemSliderRef.current && subItemTabsRef.current) {
      const allSubItems = ['전체', ...getSubItems(category)];
      const activeIndex = allSubItems.findIndex(
        (subItem) => subItem === selectedSubItem
      );
      const activeButton = subItemTabsRef.current[activeIndex];

      if (activeButton) {
        const left = activeButton.offsetLeft;
        const width = activeButton.offsetWidth;

        const indicator = subItemSliderRef.current.querySelector(
          `.${styles.slider_indicator}`
        ) as HTMLElement;
        if (indicator) {
          indicator.style.transform = `translateX(${left}px)`;
          indicator.style.width = `${width}px`;
        }
      }
    }
  }, [
    selectedSubItem,
    showSubItems,
    category,
    userDepartments,
    userGradeLabels,
  ]);

  const handleCategoryClick = (item: CategoryItem) => {
    const subItems = getSubItems(item);
    const isSameCategory = item.id === category.id;
    const shouldOpen =
      subItems.length > 1 && (!showSubItems || !isSameCategory);

    setCategory(item);
    setShowSubItems(shouldOpen);
    setSelectedSubItem(shouldOpen ? '전체' : null);
    onDepartmentPanelChange?.(shouldOpen);
  };

  const handleSubItemClick = (subItem: string) => {
    setSelectedSubItem(subItem);
  };

  const activeSubItems = getSubItems(category);

  const showSubPanel = showSubItems && activeSubItems.length > 1;

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
        padding: '5px 20px 5px 16px',
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{
          flexWrap: 'nowrap',
          overflowX: 'auto',
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

      {showSubPanel && (
        <div
          ref={subItemSliderRef}
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
              subItemTabsRef.current[0] = el;
            }}
            className={`${styles.slider_tab} ${
              selectedSubItem === '전체' ? styles.slider_tab_active : ''
            }`}
            onClick={() => handleSubItemClick('전체')}
          >
            전체
          </button>
          {activeSubItems.map((subItem, index) => (
            <button
              key={subItem}
              ref={(el) => {
                subItemTabsRef.current[index + 1] = el;
              }}
              className={`${styles.slider_tab} ${
                selectedSubItem === subItem ? styles.slider_tab_active : ''
              }`}
              onClick={() => handleSubItemClick(subItem)}
            >
              {subItem}
            </button>
          ))}
        </div>
      )}
    </Stack>
  );
}
