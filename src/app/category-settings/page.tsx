'use client';
import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  Active,
  TouchSensor,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box, List, ListItem, IconButton, Popover } from '@mui/material';
import Layout from '../../Components/LayoutDir/Layout';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import CircleIcon from '@mui/icons-material/Circle';
import { PALETTE_COLORS } from '@/constants/CategoryColorPalette';
import { useCategoryColors } from '@/contexts/CategoryColorContext';
import {
  useCategories,
  getDefaultCategories,
} from '@/contexts/CategoryContext';
import { categoryColors as DEFAULT_COLORS } from '@/constants/categories';

/** CategoryItem 타입 정의 */
interface CategoryItem {
  id: string;
  name: string;
  color: string;
  visible: boolean;
  notify: boolean;
}

/**
 * ItemView: 기본 아이템 UI
 */
function ItemView({
  item,
  index,
  onToggleNotify,
  onToggleActive,
  onOpenColorPicker,
  dragHandleProps,
}: {
  item: CategoryItem;
  index?: number;
  onToggleNotify?: (i: number) => void;
  onToggleActive?: (i: number) => void;
  onOpenColorPicker?: (e: React.MouseEvent<HTMLElement>) => void;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement> &
    Record<string, unknown>;
}) {
  const { categoryColors } = useCategoryColors();

  return (
    <ListItem
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        p: 1.5,
        backgroundColor: '#fff',
        alignItems: 'center',
      }}
    >
      {/* 왼쪽: 카테고리 배지 */}
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 1.1,
          height: 28,
          borderRadius: '9999px',
          fontSize: 15,
          backgroundColor: item.visible
            ? categoryColors[item.name] || item.color
            : '#ccc',
          color: '#fff',
          cursor: 'pointer',
        }}
      >
        {item.name}
        {item.id !== 'all' && onToggleActive && (
          <IconButton
            size="small"
            onClick={() => onToggleActive(index!)}
            sx={{
              width: 20,
              height: 20,
              color: item.visible ? '#fff' : '#69B054',
            }}
          >
            {item.visible ? (
              <ClearIcon fontSize="small" />
            ) : (
              <AddIcon fontSize="small" />
            )}
          </IconButton>
        )}
      </Box>

      {/* 오른쪽: 색상, 알림, 드래그 핸들 */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton
          onClick={onOpenColorPicker}
          size="small"
          disabled={!item.visible}
          data-category={item.name}
          sx={{ pointerEvents: 'auto' }}
        >
          <CircleIcon
            sx={{
              color: item.visible
                ? categoryColors[item.name] || item.color
                : '#999',
              fontSize: 19,
            }}
          />
        </IconButton>

        {onToggleNotify && (
          <IconButton
            onClick={() => onToggleNotify(index!)}
            size="small"
            disabled={!item.visible}
          >
            {item.notify ? (
              <NotificationsIcon
                sx={{ color: item.visible ? '#4d4d4dff' : '#999' }}
              />
            ) : (
              <NotificationsOffIcon sx={{ color: '#999' }} />
            )}
          </IconButton>
        )}

        {/* 드래그 핸들 */}
        <Box
          {...(dragHandleProps || {})}
          sx={{
            display: 'flex',
            alignItems: 'center',
            padding: '6px',
            borderRadius: 1,
            cursor: 'grab',
            touchAction: 'none',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <IconButton size="small">
            <DragHandleIcon sx={{ color: '#494949ff' }} />
          </IconButton>
        </Box>
      </Box>
    </ListItem>
  );
}

/**
 * SortableItem: 드래그 가능한 아이템
 */
function SortableItem({
  item,
  index,
  onToggleNotify,
  onToggleActive,
  onOpenColorPicker,
}: {
  item: CategoryItem; // 수정
  index: number;
  onToggleNotify?: (i: number) => void;
  onToggleActive?: (i: number) => void;
  onOpenColorPicker?: (e: React.MouseEvent<HTMLElement>) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <ItemView
        item={item}
        index={index}
        onToggleNotify={onToggleNotify}
        onToggleActive={onToggleActive}
        onOpenColorPicker={onOpenColorPicker}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

/**
 * ColorPicker
 */
function ColorPicker({
  anchorEl,
  onClose,
  onSelect,
}: {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onSelect: (color: string) => void;
}) {
  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      PaperProps={{ sx: { zIndex: 1500, borderRadius: '20px' } }}
    >
      <Box sx={{ display: 'flex', flexWrap: 'wrap', height: 80, width: 260 }}>
        {Object.values(PALETTE_COLORS).map((color) => (
          <IconButton
            key={color}
            onClick={() => onSelect(color)}
            sx={{ width: '16.5%', p: 0.5, minWidth: 0 }}
          >
            <CircleIcon sx={{ color, fontSize: 25 }} />
          </IconButton>
        ))}
      </Box>
    </Popover>
  );
}

/**
 * Page
 */
export default function CategorySettingsPage() {
  const { items, setItems } = useCategories();
  const { setCategoryColor } = useCategoryColors();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [colorPickerAnchor, setColorPickerAnchor] =
    useState<HTMLElement | null>(null);
  const [colorPickerCategory, setColorPickerCategory] = useState<string | null>(
    null
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 5 },
    })
  );

  const handleReset = () => {
    const defaults = getDefaultCategories();
    setItems(defaults);
    localStorage.setItem('categories', JSON.stringify(defaults));
    setCategoryColorBulk(DEFAULT_COLORS);
    localStorage.setItem('categoryColors', JSON.stringify(DEFAULT_COLORS));
  };

  const setCategoryColorBulk = (colors: Record<string, string>) => {
    Object.entries(colors).forEach(([cat, color]) =>
      setCategoryColor(cat, color)
    );
  };

  const handleDragStart = ({ active }: { active: Active }) => {
    setActiveId(String(active.id));
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        const newItems = arrayMove(items, oldIndex, newIndex);
        setItems(newItems);
        localStorage.setItem('categories', JSON.stringify(newItems));
      }
    }
    setActiveId(null);
  };

  const handleToggleNotify = (index: number) => {
    setItems((prev) =>
      prev.map((it, i) => (i === index ? { ...it, notify: !it.notify } : it))
    );
  };

  const handleToggleActive = (index: number) => {
    setItems((prev) => {
      const newItems = [...prev];
      const toggled = { ...newItems[index], visible: !newItems[index].visible };
      newItems.splice(index, 1);
      if (toggled.visible) {
        const allIndex = newItems.findIndex((i) => i.id === 'all');
        newItems.splice(allIndex + 1, 0, toggled);
      } else {
        newItems.push(toggled);
      }
      return newItems;
    });
  };

  const handleOpenColorPicker = (e: React.MouseEvent<HTMLElement>) => {
    setColorPickerAnchor(e.currentTarget);
    const cn = e.currentTarget.getAttribute('data-category');
    if (cn) setColorPickerCategory(cn);
  };

  const handleSelectColor = (color: string) => {
    if (!colorPickerCategory) return;
    setCategoryColor(colorPickerCategory, color);
    setItems((prev) =>
      prev.map((it) =>
        it.name === colorPickerCategory ? { ...it, color } : it
      )
    );
    setColorPickerAnchor(null);
    setColorPickerCategory(null);
  };

  return (
    <Layout
      headerProps={{
        pageType: 'settings',
        settingsHeaderProps: { title: '카테고리 설정', onReset: handleReset },
      }}
      hideBottomNav
      backgroundColor="#f3f3f3ff"
      fullHeight
      style={{ overflow: 'hidden' }}
    >
      <div
        style={{
          padding: '20px 20px 40px 40px',
          fontSize: '13px',
          height: '90px',
          boxSizing: 'border-box',
        }}
      >
        카테고리 표시, 색상, 알림, 순서를 설정할 수 있습니다.
        <br />
        원하는 카테고리 공지만 확인할 수 있어요.
      </div>

      <div
        style={{
          flex: 1,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          backgroundColor: '#fff',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ p: 1, marginTop: -1, flex: 1, overflowY: 'auto' }}>
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={items.map((i) => i.id)}
              strategy={verticalListSortingStrategy}
            >
              <List sx={{ flex: 1, overflow: 'hidden' }}>
                {items.map((item: CategoryItem, index: number) => (
                  <React.Fragment key={item.id}>
                    <SortableItem
                      item={item}
                      index={index}
                      onToggleNotify={handleToggleNotify}
                      onToggleActive={handleToggleActive}
                      onOpenColorPicker={handleOpenColorPicker}
                    />
                    <hr style={{ color: '#414141ff', margin: 0 }} />
                  </React.Fragment>
                ))}
              </List>
            </SortableContext>

            <DragOverlay>
              {activeId ? (
                <ItemView
                  item={items.find((i) => i.id === activeId)!}
                  onToggleNotify={handleToggleNotify}
                  onToggleActive={handleToggleActive}
                  onOpenColorPicker={handleOpenColorPicker}
                />
              ) : null}
            </DragOverlay>
          </DndContext>

          <ColorPicker
            anchorEl={colorPickerAnchor}
            onClose={() => setColorPickerAnchor(null)}
            onSelect={handleSelectColor}
          />
        </Box>
      </div>
    </Layout>
  );
}
