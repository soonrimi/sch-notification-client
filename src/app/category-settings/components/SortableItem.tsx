'use client';
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ItemView from './ItemView';
import { CategoryItem } from '@/contexts/CategoryContext';

type Props = {
  item: CategoryItem;
  index: number;
  onToggleNotify?: (i: number) => void;
  onToggleActive?: (i: number) => void;
  onOpenColorPicker?: (e: React.MouseEvent<HTMLElement>) => void;
};

export default function SortableItem(props: Props) {
  const { item } = props;
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
      <ItemView {...props} dragHandleProps={{ ...attributes, ...listeners }} />
    </div>
  );
}
