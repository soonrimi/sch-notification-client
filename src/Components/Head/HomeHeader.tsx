'use client';
import React from 'react';
import { Stack, IconButton } from '@mui/material';
import Image from 'next/image';
import SettingsIcon from '@mui/icons-material/Settings';
import styles from './Header.module.css';
import Link from 'next/link';
import type { CategoryItem } from '@/contexts/CategoryContext';
import HomeHeaderCategorys from './HomeHeaderCategorys';

interface HomeHeaderProps {
  category?: CategoryItem;
  setCategory?: React.Dispatch<React.SetStateAction<CategoryItem>>;
  categories?: CategoryItem[];
}

export default function HomeHeader({
  category,
  setCategory,
  categories,
}: HomeHeaderProps) {
  return (
    <div
      className={styles.header_wrapper}
      style={{ flexDirection: 'column', height: '100%' }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        sx={{ width: '100%', padding: '10px 16px' }}
      >
        <Stack
          direction="row"
          alignItems="center"
          className={styles.header_right_home}
        >
          <IconButton
            component={Link}
            href="/search?from=home"
            className={styles.click_no_effect}
            sx={{ p: 0 }}
          >
            <Image
              src="/icons/search_icon.png"
              alt="검색"
              width={18}
              height={21}
              className={styles.icon_small}
            />
          </IconButton>
          <IconButton
            component={Link}
            href="/settings"
            className={styles.click_no_effect}
            sx={{ p: 0 }}
          >
            <SettingsIcon className={styles.icon_settings} />
          </IconButton>
        </Stack>
      </Stack>

      {category && setCategory && categories && (
        <HomeHeaderCategorys
          category={category}
          setCategory={setCategory}
          categories={categories}
        />
      )}
    </div>
  );
}
