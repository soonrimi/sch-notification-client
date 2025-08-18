import { useCallback, useRef } from "react";
import type React from "react";
import moment from "moment";

type Handlers = {
  onWheel: React.WheelEventHandler<HTMLDivElement>;
  onTouchStart: React.TouchEventHandler<HTMLDivElement>;
  onTouchMove: React.TouchEventHandler<HTMLDivElement>;
  onTouchEnd: React.TouchEventHandler<HTMLDivElement>;
  onKeyDown: React.KeyboardEventHandler<HTMLDivElement>;
};

type Options = {
  wheelThreshold?: number;   // 기본 100
  swipeThreshold?: number;   // 기본 40 (px)
  cooldownMs?: number;       // 기본 250
};

//월 전환 네비게이션(휠/스와이프/키보드)을 제공하는 훅
export function useMonthNavigation(
  setCurrent: React.Dispatch<React.SetStateAction<moment.Moment>>,
  opts: Options = {}
): Handlers {
  const WHEEL_THRESHOLD = opts.wheelThreshold ?? 100;
  const SWIPE_THRESHOLD = opts.swipeThreshold ?? 40;
  const COOLDOWN = opts.cooldownMs ?? 250;

  const wheelAccumRef = useRef(0);
  const lastSwitchRef = useRef(0);
  const touchStartY = useRef<number | null>(null);

  const changeMonth = useCallback((diff: number) => {
    const now = Date.now();
    if (now - lastSwitchRef.current < COOLDOWN) return;
    lastSwitchRef.current = now;
    setCurrent(prev => prev.clone().add(diff, "month"));
  }, [COOLDOWN, setCurrent]);

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

  const onTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchMove: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (touchStartY.current == null) return;
    const dy = e.touches[0].clientY - touchStartY.current;
    if (dy > SWIPE_THRESHOLD) {
      changeMonth(-1); 
      touchStartY.current = null;
    } else if (dy < -SWIPE_THRESHOLD) {
      changeMonth(1); 
      touchStartY.current = null;
    }
  };

  const onTouchEnd: React.TouchEventHandler<HTMLDivElement> = () => {
    touchStartY.current = null;
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === "ArrowUp") changeMonth(-1);
    if (e.key === "ArrowDown") changeMonth(1);
  };

  return { onWheel, onTouchStart, onTouchMove, onTouchEnd, onKeyDown };
}
