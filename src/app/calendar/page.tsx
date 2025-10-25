'use client';
import { useState, useMemo, useRef, useEffect } from 'react';
import styles from './page.module.css';
import useCalendarCells, { CalendarCell } from './hooks/useCalendarCells';
import EventItem from './Components/EventItem';
import DayKor from './Components/DayKor';
import dayjs, { Dayjs } from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import SearchIcon from '@mui/icons-material/Search';
import BottomNav from '@/Components/Bottom/BottomNav';
import { CalenderApiService } from '@/api';
import { CalenderDto_Response } from '@/api/models/CalenderDto_Response';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useRouter } from 'next/navigation';

dayjs.extend(isSameOrBefore);
dayjs.extend(customParseFormat);

export default function Calendar() {
  const [current, setCurrent] = useState<Dayjs>(dayjs());

  const headRef = useRef<HTMLDivElement>(null);
  const [headH, setHeadH] = useState<number>(0);

  useEffect(() => {
    const measure = () => {
      const h = headRef.current?.getBoundingClientRect().height ?? 0;
      setHeadH(h);
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
  const [calendar, setCalendar] = useState<CalenderDto_Response[]>([]);

  const eventsByYmd = useMemo(() => {
    const map = new Map<string, CalenderDto_Response[]>();
    for (const ev of calendar) {
      const start = dayjs(ev.startDate);
      const end = dayjs(ev.endDate ?? ev.startDate);
      let cursor = start.startOf('day');
      const last = end.startOf('day');

      while (cursor.isSameOrBefore(last)) {
        const key = cursor.format('YYYYMMDD');
        if (!map.has(key)) map.set(key, []);
        cursor = cursor.add(1, 'day');
      }
    }
    return map;
  }, []);

  const router = useRouter();

  useEffect(() => {
    CalenderApiService.getAllCalenders({
      page: 0,
      size: 1000,
      sort: [],
    }).then((data) => {
      setCalendar(data.content ?? []);
      console.log('캘린더 응답:', data);
    });
  }, []);

  return (
    <div className={styles.App}>
      <div ref={headRef} className={styles.calendar_head}>
        <div className={styles.head_top}>
          <div className={styles.header_year}>{current.year()}년</div>
          <div className={styles.header_right}>
            <SearchIcon onClick={() => router.push('/search')} />
            <div
              className={styles.today_box}
              onClick={() => setCurrent(dayjs())}
              style={{ cursor: 'pointer' }}
            >
              {dayjs().format('DD')}
            </div>
          </div>
        </div>
        <div className={styles.calendar_month}>
          <NavigateBeforeIcon
            onClick={() => setCurrent((prev) => prev.subtract(1, 'month'))}
            style={{ cursor: 'pointer' }}
          />
          <div>{current.format('M월')}</div>
          <NavigateNextIcon
            onClick={() => setCurrent((prev) => prev.add(1, 'month'))}
            style={{ cursor: 'pointer' }}
          />
        </div>

        <div className={styles.calendar_day_kr}>
          <DayKor />
        </div>
      </div>

      <div
        className={styles.calendar_body}
        tabIndex={0}
        style={{ outline: 'none', paddingTop: headH }}
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
                        {dayEvents.map((calendar) => (
                          <EventItem
                            key={`${ymd}-${calendar.id}`}
                            event={calendar}
                          />
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
