'use client';
import { useState, useMemo } from 'react';
import styles from './page.module.css';
import { useMonthNavigation } from './hooks/useMonthNavigation';
import useCalendarCells, { CalendarCell } from './hooks/useCalendarCells';
import EventItem from './Components/EventItem';
import { CalendarEvent } from '@/types/calendar';
import DayKor from './Components/DayKor';
import { DUMMY_EVENTS } from '@/data/calendarDummy';
import dayjs, { Dayjs } from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Layout from '@/Components/LayoutDir/Layout';
dayjs.extend(isSameOrBefore);
dayjs.extend(customParseFormat);

export default function Calendar() {
  const [current, setCurrent] = useState<Dayjs>(dayjs());

  const nav = useMonthNavigation(setCurrent, {
    wheelThreshold: 100,
    swipeThreshold: 40,
    cooldownMs: 250,
  });

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
    <Layout pageType="calendar">
      <div className={styles.calendar_head}>
        <div className={styles.calendar_month}>{current.format("M월")}</div>
         <div className={styles.calendar_day_kr}><DayKor /></div>
         </div>
      <div
        className={styles.calendar_body}
        tabIndex={0}
        style={{ outline: 'none' }}
        onWheel={nav.onWheel}
      >
        <div className={styles.calendar_body_box}>
          {weeks.map(
            (
              row: CalendarCell[],
              wIdx: number //주단위 렌더링
            ) => (
              <div className={styles.calendar_body_line} key={wIdx}>
                {row.map((cell: CalendarCell, idx: number) => {
                  //각 날짜 렌더링
                  const ymd = cell.ymd;
                  const dayEvents = eventsByYmd.get(ymd) ?? [];

                  return (
                    <div
                      className={styles.calendar_body_days}
                      key={cell.ymd}
                      onClick={() => console.log(cell.ymd)}
                    >
                      <span
                        style={cellColor(cell.date, idx, cell.isOtherMonth)}
                      >
                        {cell.dayLabel}
                      </span>

                      <div className={styles.calendar_event}>
                        {dayEvents.map((ev) => {
                          return (
                            <EventItem key={`${ymd}-${ev.id}`} event={ev} />
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}
        </div>
      </div>
    </Layout>
  );
}

function cellColor(day: Dayjs, idx: number, isOtherMonth: boolean) {
  if (day.isSame(dayjs(), 'day')) {
    //오늘
    return {
      backgroundColor: 'black',
      color: 'white',
      borderRadius: '6px',
      padding: '2px 6px',
      display: 'inline-block',
      fontWeight: 'bold',
    };
  }
  if (idx === 0 && isOtherMonth) {
    //다른달 일요일
    return { color: '#FFADAD' };
  }
  if (idx === 6 && isOtherMonth) {
    //다른달 토요일
    return { color: '#E6D47F' };
  }
  if (isOtherMonth) {
    //다른달 평일
    return { color: '#b1b1b1' };
  }
  if (idx === 0) {
    //해당달 일요일
    return { color: '#FF6060', fontWeight: 'bold' };
  }
  if (idx === 6) {
    //해당달 토요일
    return { color: '#D5B829', fontWeight: 'bold' };
  }
  return { fontWeight: 'bold' };
}
