'use client';
import React from 'react';
import { Box, ListItem, IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import CircleIcon from '@mui/icons-material/Circle';
import { CategoryItem } from '@/contexts/CategoryContext';
import { useCategoryColors } from '@/contexts/CategoryColorContext';
import styles from '../page.module.css';

type Props = {
  item: CategoryItem;
  index?: number;
  onToggleNotify?: (i: number) => void;
  onToggleActive?: (i: number) => void;
  onOpenColorPicker?: (e: React.MouseEvent<HTMLElement>) => void;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement> &
    Record<string, unknown>;
};

export default function ItemView({
  item,
  index,
  onToggleNotify,
  onToggleActive,
  onOpenColorPicker,
  dragHandleProps,
}: Props) {
  const { categoryColors } = useCategoryColors();

  return (
    <ListItem className={styles.listItem}>
      {/* 카테고리 배지 */}
      <Box
        className={`${styles.badge} ${item.visible ? '' : styles.badgeInactive}`}
        sx={{
          backgroundColor: item.visible
            ? item.color || categoryColors[item.name] || '#000'
            : '#ccc',
        }}
      >
        {item.name}
        {item.id !== '전체' && onToggleActive && (
          <IconButton
            size="small"
            onClick={() => onToggleActive(index!)}
            className={styles.badgeBtn}
          >
            {item.visible ? (
              <ClearIcon fontSize="small" />
            ) : (
              <AddIcon fontSize="small" />
            )}
          </IconButton>
        )}
      </Box>

      {/* 색상, 알림, 드래그 */}
      <Box className={styles.actions}>
        <IconButton
          onClick={onOpenColorPicker}
          size="small"
          disabled={!item.visible}
          data-category={item.name}
        >
          <CircleIcon
            sx={{
              color: item.visible
                ? item.color || categoryColors[item.name] || '#000'
                : '#999',
            }}
          />
        </IconButton>

        {onToggleNotify && item.id !== '전체' && (
          <IconButton
            onClick={() => onToggleNotify(index!)}
            size="small"
            disabled={!item.visible}
          >
            {item.notify ? (
              <NotificationsIcon className={styles.iconActive} />
            ) : (
              <NotificationsOffIcon className={styles.iconInactive} />
            )}
          </IconButton>
        )}

        <Box {...(dragHandleProps || {})} className={styles.dragHandle}>
          <IconButton size="small">
            <DragHandleIcon />
          </IconButton>
        </Box>
      </Box>
    </ListItem>
  );
}
