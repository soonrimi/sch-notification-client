'use client';
import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Box,
  List,
  ListItem,
  IconButton,
  Popover,
  Button,
} from '@mui/material';
import Layout from '../../Components/LayoutDir/Layout';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import CircleIcon from '@mui/icons-material/Circle';
import { PALETTE_COLORS } from '@/constants/CategoryColorPalette';
import { useCategoryColors } from '@/contexts/CategoryColorContext';
import { useCategories } from '@/contexts/CategoryContext';
import { getDefaultCategories } from '@/contexts/CategoryContext';
import { categoryColors as DEFAULT_COLORS } from '@/constants/categories';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { styleText } from 'util';

interface SortableItemProps {
  item: {
    id: string;
    name: string;
    color: string;
    notify: boolean;
    visible: boolean;
  };
  index: number;
  onToggleNotify: (index: number) => void;
  onToggleActive: (index: number) => void;
  onOpenColorPicker: (event: React.MouseEvent<HTMLElement>) => void;
}

function SortableItem({
  item,
  index,
  onToggleNotify,
  onToggleActive,
  onOpenColorPicker,
}: SortableItemProps) {
  const { categoryColors } = useCategoryColors();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <ListItem
      ref={setNodeRef}
      style={style}
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        p: 1.5,
        backgroundColor: '#fff',
        alignItems: 'center',
      }}
    >
      {/* 카테고리 버튼 */}
      <Button
        sx={{
          color: '#fff',
          width: 68,
          height: 28,
          borderRadius: '9999px',
          fontSize: 15,
          flexShrink: 0,
          backgroundColor: item.visible
            ? categoryColors[item.name] || item.color
            : '#ccc',
        }}
      >
        {item.name}
        {item.id !== 'all' && (
          <IconButton
            size="small"
            onClick={() => onToggleActive(index)}
            sx={{
              color: item.visible ? '#ffffffff' : '#69B054',
              width: 20,
              height: 20,
            }}
          >
            {item.visible ? (
              <ClearIcon fontSize="small" />
            ) : (
              <AddIcon fontSize="small" />
            )}
          </IconButton>
        )}
      </Button>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {/* 색상 변경 */}
        <IconButton
          onClick={onOpenColorPicker}
          size="small"
          disabled={!item.visible}
          data-category={item.name}
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

        {/* 알림 토글 */}
        <IconButton
          onClick={() => onToggleNotify(index)}
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

        {/* 드래그 핸들 */}
        <IconButton {...attributes} {...listeners} size="small">
          <DragHandleIcon />
        </IconButton>
      </Box>
    </ListItem>
  );
}

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

export default function CategorySettingsPage() {
  const { items, setItems } = useCategories();
  const { setCategoryColor } = useCategoryColors();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [colorPickerAnchor, setColorPickerAnchor] =
    useState<HTMLElement | null>(null);
  const [colorPickerCategory, setColorPickerCategory] = useState<string | null>(
    null
  );

  const sensors = useSensors(useSensor(PointerSensor));
  const handleReset = () => {
    // ✅ 카테고리 아이템 초기화
    const defaults = getDefaultCategories();
    setItems(defaults);
    localStorage.setItem('categories', JSON.stringify(defaults));

    // ✅ 색상 초기화
    setCategoryColorBulk(DEFAULT_COLORS);
    localStorage.setItem('categoryColors', JSON.stringify(DEFAULT_COLORS));
  };

  const setCategoryColorBulk = (colors: Record<string, string>) => {
    Object.entries(colors).forEach(([cat, color]) => {
      setCategoryColor(cat, color);
    });
  };

  const handleDragStart = ({ active }: { active: any }) =>
    setActiveId(active.id);
  const handleDragCancel = () => setActiveId(null);

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) return;
    if (active.id !== over.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      setItems(arrayMove(items, oldIndex, newIndex));
    }
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over) return setActiveId(null);
    if (active.id !== over.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      setItems(arrayMove(items, oldIndex, newIndex));
    }
    setActiveId(null);
  };

  const handleToggleNotify = (index: number) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, notify: !item.notify } : item
      )
    );
  };

  const handleToggleActive = (index: number) => {
    setItems((prev) => {
      const newItems = [...prev];
      // 1. visible 토글
      newItems[index] = {
        ...newItems[index],
        visible: !newItems[index].visible,
      };

      // 2. 만약 false로 바뀌었으면 맨 뒤로 이동
      if (!newItems[index].visible) {
        const [item] = newItems.splice(index, 1); // 기존 위치에서 제거
        newItems.push(item); // 맨 뒤로 추가
      }

      return newItems;
    });
  };

  const handleOpenColorPicker = (event: React.MouseEvent<HTMLElement>) => {
    setColorPickerAnchor(event.currentTarget);
    const categoryName = event.currentTarget.getAttribute('data-category');
    if (categoryName) setColorPickerCategory(categoryName);
  };

  const handleSelectColor = (color: string) => {
    if (!colorPickerCategory) return;
    setCategoryColor(colorPickerCategory, color);
    setItems((prev) =>
      prev.map((item) =>
        item.name === colorPickerCategory ? { ...item, color } : item
      )
    );
    handleCloseColorPicker();
  };

  const handleCloseColorPicker = () => {
    setColorPickerAnchor(null);
    setColorPickerCategory(null);
  };

  return (
    <Layout
      headerProps={{
        pageType: 'categorysettings',
        categoryHeaderProps: { onReset: handleReset },
      }}
      hideBottomNav
      backgroundColor="#EEEEEE"
    >
      <div
        style={{
          padding: '20px 20px 40px 40px',
          fontSize: '13px',
          height: '90px',
        }}
      >
        카테고리 표시, 색상, 알림, 순서를 설정할 수 있습니다.
        <br />
        원하는 카테고리 공지만 확인할 수 있어요.
      </div>
      <div
        style={{
          border: '1px solid #ffffffff',
          borderTopLeftRadius: '30px',
          borderTopRightRadius: '30px',
          backgroundColor: '#ffffffff',
          height: `calc(100vh - 45px - 48px - 90px )`,
        }}
      >
        <Box sx={{ p: 1, marginTop: -1 }}>
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragCancel={handleDragCancel}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={items.map((i) => i.id)}
              strategy={verticalListSortingStrategy}
            >
              <List>
                {items.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <SortableItem
                      item={item}
                      index={index}
                      onToggleNotify={handleToggleNotify}
                      onToggleActive={handleToggleActive}
                      onOpenColorPicker={handleOpenColorPicker}
                    />

                    <hr
                      style={{
                        color: '#414141ff',
                        margin: 0,
                      }}
                    />
                  </React.Fragment>
                ))}
              </List>
            </SortableContext>

            <DragOverlay>
              {activeId ? (
                <SortableItem
                  item={items.find((i) => i.id === activeId)!}
                  index={0}
                  onToggleNotify={() => {}}
                  onToggleActive={() => {}}
                  onOpenColorPicker={() => {}}
                />
              ) : null}
            </DragOverlay>
          </DndContext>

          <ColorPicker
            anchorEl={colorPickerAnchor}
            onClose={handleCloseColorPicker}
            onSelect={handleSelectColor}
          />
        </Box>
      </div>
    </Layout>
  );
}
