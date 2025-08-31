'use client';
import { useState, useMemo, useRef, useEffect } from 'react';
import styles from './page.module.css';
import { useSwipe } from './hooks/useMonthNavigation';
import useCalendarCells, { CalendarCell } from './hooks/useCalendarCells';
import EventItem from './Components/EventItem';
import { CalendarEvent } from '@/types/calendar';
import DayKor from './Components/DayKor';
import { DUMMY_EVENTS } from '@/mock/calendarDummy';
import dayjs, { Dayjs } from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import SearchIcon from '@mui/icons-material/Search';
import BottomNav from '@/Components/Bottom/BottomNav';

dayjs.extend(isSameOrBefore);
dayjs.extend(customParseFormat);

export default function Calendar() {
  const [current, setCurrent] = useState<Dayjs>(dayjs());
  const nav = useSwipe(setCurrent, {
    swipeThreshold: 60,
    wheelThreshold: 100,
  });

  const headRef = useRef<HTMLDivElement>(null);
  const [headH, setHeadH] = useState<number>(0);

  // 🔧 헤더 실제 높이를 측정해 상단 패딩에 반영
  useEffect(() => {
    const measure = () => {
      const h = headRef.current?.getBoundingClientRect().height ?? 0;
      setHeadH(h);
      // CSS 변수로도 내려줘서 CSS에서 기본값 대신 사용
      document.documentElement.style.setProperty('--cal-head-h', `${h}px`);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (headRef.current) ro.observe(headRef.current);
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('resize', measure);
      ro.disconnect();
    };
  }, []);

  const weeks = useCalendarCells(current);

  const eventsByYmd = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const ev of DUMMY_EVENTS) {
      const start = dayjs(ev.start);
      const end = dayjs(ev.end ?? ev.start);
      let cursor = start.startOf('day');
      const last = end.startOf('day');

      while (cursor.isSameOrBefore(last)) {
        const key = cursor.format('YYYYMMDD');
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push(ev);
        cursor = cursor.add(1, 'day');
      }
    }
    return map;
  }, []);

  return (
    <div className={styles.App}>
      <div ref={headRef} className={styles.calendar_head}>
        <div className={styles.head_top}>
          <div className={styles.header_year}>{current.year()}년</div>
          <div className={styles.header_right}>
            <SearchIcon />
            <div className={styles.today_box}>{dayjs().format('DD')}</div>
          </div>
        </div>
        <div className={styles.calendar_month}>{current.format('M월')}</div>
        <div className={styles.calendar_day_kr}>
          <DayKor />
        </div>
      </div>

      <div
        className={styles.calendar_body}
        tabIndex={0}
        style={{ outline: 'none', paddingTop: headH }}
        onWheel={nav.onWheel}
        onPointerDown={nav.onPointerDown}
        onPointerMove={nav.onPointerMove}
        onPointerUp={nav.onPointerUp}
      >
        <div className={styles.calendar_body_box}>
          {weeks.map(
            (
              row: CalendarCell[],
              wIdx: number // 주 단위 렌더링
            ) => (
              <div className={styles.calendar_body_line} key={wIdx}>
                {row.map((cell: CalendarCell, idx: number) => {
                  const ymd = cell.ymd;
                  const dayEvents = eventsByYmd.get(ymd) ?? [];

                  return (
                    <div
                      className={styles.calendar_body_days}
                      key={cell.ymd}
                      onClick={() => console.log(cell.ymd)}
                    >
                      <span
                        className={styles.date_num}
                        style={cellColor(cell.date, idx, cell.isOtherMonth)}
                      >
                        {cell.dayLabel}
                      </span>

                      <div>
                        {dayEvents.map((ev) => (
                          <EventItem key={`${ymd}-${ev.id}`} event={ev} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}
        </div>
      </div>

      <div className={styles.bottom_nav_wrapper} style={{ height: 48 }}>
        <BottomNav />
      </div>
    </div>
  );
}

function cellColor(day: Dayjs, idx: number, isOtherMonth: boolean) {
  if (day.isSame(dayjs(), 'day')) {
    return {
      backgroundColor: 'black',
      color: 'white',
      borderRadius: '6px',
      padding: '2px 6px',
      display: 'inline-block',
    };
  }
  if (idx === 0 && isOtherMonth) return { color: '#FFADAD' };
  if (idx === 6 && isOtherMonth) return { color: '#E6D47F' };
  if (isOtherMonth) return { color: '#b1b1b1' };
  if (idx === 0) return { color: '#FF6060' };
  if (idx === 6) return { color: '#D5B829' };
  return undefined;
}
