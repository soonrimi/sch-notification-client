'use client';
import { Stack, IconButton } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './Header.module.css';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

export default function NotificationHeader() {
  const router = useRouter();

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        px: 2,
        width: '100%',
        height: '100%',
        backgroundColor: '#ffffff',
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        <div className={styles.bookmark_title}>알림</div>
      </Stack>

      <Stack direction="row" alignItems="center">
        <IconButton onClick={() => router.push('/search?scope=all')}>
          <Image
            src="/icons/search_icon.png"
            alt="검색"
            width={18}
            height={21}
            className={styles.icon_small}
          />
        </IconButton>
        <DeleteOutlineIcon />
      </Stack>
    </Stack>
  );
}
