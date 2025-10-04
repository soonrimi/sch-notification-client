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
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Box, List } from '@mui/material';
import Layout from '../../Components/LayoutDir/Layout';
import { useCategoryColors } from '@/contexts/CategoryColorContext';
import {
  useCategories,
  getDefaultCategories,
  CategoryItem,
} from '@/contexts/CategoryContext';
import { CATEGORY_COLORS } from '@/constants/categories';
import styles from './page.module.css';
import SortableItem from './components/SortableItem';
import ColorPicker from './components/ColorPicker';
import ItemView from './components/ItemView';
import { SubscribeControllerService } from '@/api/services/SubscribeControllerService';

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
    setCategoryColorBulk(CATEGORY_COLORS);
    localStorage.setItem('categoryColors', JSON.stringify(CATEGORY_COLORS));
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

  const handleToggleNotify = async (index: number) => {
    setItems((prev) => {
      const newItems = prev.map((it, i) =>
        i === index ? { ...it, notify: !it.notify } : it
      );

      const changed = newItems[index];

      if (changed.notify) {
        SubscribeControllerService.create({
          category: changed.name,
        }).catch((err) => console.error('구독 등록 실패:', err));
      } else {
        if (changed.subscribeId) {
          SubscribeControllerService.delete(changed.subscribeId).catch((err) =>
            console.error('구독 해제 실패:', err)
          );
        }
      }
      return newItems;
    });
  };

  const handleToggleActive = (index: number) => {
    setItems((prev) => {
      if (prev[index].id === '전체') return prev;

      const newItems = [...prev];
      newItems[index] = {
        ...newItems[index],
        visible: !newItems[index].visible,
      };
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
      backgroundColor="#f9fafb"
      fullHeight
    >
      <div className={styles.headerDesc}>
        각 카테고리의 색상, 알림, 순서를 설정할 수 있습니다.
      </div>

      <div className={styles.contentWrapper}>
        <Box className={styles.listWrapper}>
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={items.map((i) => i.id)}
              strategy={verticalListSortingStrategy}
            >
              <List className={styles.list}>
                {items.map((item: CategoryItem, index: number) => (
                  <React.Fragment key={item.id}>
                    <SortableItem
                      item={item}
                      index={index}
                      onToggleNotify={handleToggleNotify}
                      onToggleActive={handleToggleActive}
                      onOpenColorPicker={handleOpenColorPicker}
                    />
                    <hr className={styles.divider} />
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
