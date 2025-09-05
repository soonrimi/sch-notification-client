import { useCallback, useRef } from 'react';
import type React from 'react';
import type { Dayjs } from 'dayjs';

type Handlers = {
  onWheel: React.WheelEventHandler<HTMLDivElement>;
  onPointerDown: React.PointerEventHandler<HTMLDivElement>;
  onPointerMove: React.PointerEventHandler<HTMLDivElement>;
  onPointerUp: React.PointerEventHandler<HTMLDivElement>;
  style: React.CSSProperties;
};

type Options = {
  wheelThreshold?: number;
  swipeThreshold?: number;
  cooldownMs?: number;
};

export function useSwipe(
  setCurrent: React.Dispatch<React.SetStateAction<Dayjs>>,
  opts: Options = {}
): Handlers {
  const WHEEL_THRESHOLD = opts.wheelThreshold ?? 100;
  const SWIPE_THRESHOLD = opts.swipeThreshold ?? 60;
  const COOLDOWN = opts.cooldownMs ?? 250;

  const lastSwitchRef = useRef(0);

  const wheelAccumRef = useRef(0);

  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);
  const isTouch = useRef(false);
  const lockedAxis = useRef<'x' | 'y' | null>(null); // 제스처 방향 잠금

  const changeMonth = useCallback(
    (diff: number) => {
      const now = Date.now();
      if (now - lastSwitchRef.current < COOLDOWN) return;
      lastSwitchRef.current = now;
      setCurrent((prev) => prev.clone().add(diff, 'month'));
    },
    [COOLDOWN, setCurrent]
  );

  const onWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
    wheelAccumRef.current += e.deltaY;
    if (wheelAccumRef.current > WHEEL_THRESHOLD) {
      changeMonth(1);
      wheelAccumRef.current = 0;
    } else if (wheelAccumRef.current < -WHEEL_THRESHOLD) {
      changeMonth(-1);
      wheelAccumRef.current = 0;
    }
  };

  const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
    isTouch.current = e.pointerType === 'touch';
    startX.current = e.clientX;
    startY.current = e.clientY;
    lockedAxis.current = null;
  };

  const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (!isTouch.current || startX.current == null || startY.current == null)
      return;

    const dx = e.clientX - startX.current;
    const dy = e.clientY - startY.current;

    if (!lockedAxis.current) {
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);
      if (absX > 8 || absY > 8) {
        lockedAxis.current = absX > absY ? 'x' : 'y';
      }
    }

    if (lockedAxis.current === 'x') {
      e.preventDefault();

      if (Math.abs(dx) > SWIPE_THRESHOLD) {
        if (dx < 0) changeMonth(1);
        else changeMonth(-1);

        startX.current = e.clientX;
        startY.current = e.clientY;
        lockedAxis.current = 'x';
      }
    }
  };

  const onPointerUp: React.PointerEventHandler<HTMLDivElement> = () => {
    startX.current = null;
    startY.current = null;
    isTouch.current = false;
    lockedAxis.current = null;
  };

  return {
    onWheel,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    style: { touchAction: 'pan-y' },
  };
}
