import { useCallback, useRef } from 'react';
import type React from 'react';
import { Dayjs } from 'dayjs';

type Handlers = {
  onWheel: React.WheelEventHandler<HTMLDivElement>;
};

type Options = {
  wheelThreshold?: number; // 기본 100
  swipeThreshold?: number; // 기본 40 (px)
  cooldownMs?: number; // 기본 250
};

//월 전환 네비게이션(휠)을 제공하는 훅
export function useMonthNavigation(
  setCurrent: React.Dispatch<React.SetStateAction<Dayjs>>,
  opts: Options = {}
): Handlers {
  const WHEEL_THRESHOLD = opts.wheelThreshold ?? 100;
  const COOLDOWN = opts.cooldownMs ?? 250;

  const wheelAccumRef = useRef(0);
  const lastSwitchRef = useRef(0);

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

  return { onWheel };
}
