'use client';
import { useState, useRef, useEffect } from 'react';
import styles from './page.module.css';
import useCalendarCells, { CalendarCell } from './hooks/useCalendarCells';
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
import EventBar from './Components/EventBar';

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

  const router = useRouter();

  useEffect(() => {
    CalenderApiService.getAllCalenders()
      .then((data) => {
        setCalendar(data ?? []);
        console.log('캘린더 응답:', data);
      })
      .catch((err) => {
        console.error(err);
        setCalendar([]);
      });
  }, []);

  type LaidOutEvent = CalenderDto_Response & { lane: number };

  function layoutWeekEvents(
    events: CalenderDto_Response[],
    weekStart: Dayjs,
    weekEnd: Dayjs
  ): { placed: LaidOutEvent[]; maxLane: number } {
    const normalized = events.map((ev) => {
      const start = dayjs(ev.startDate).isBefore(weekStart)
        ? weekStart
        : dayjs(ev.startDate);
      const endRaw = dayjs(ev.endDate ?? ev.startDate);
      const end = endRaw.isAfter(weekEnd) ? weekEnd : endRaw;
      return { ev, start, end };
    });

    normalized.sort((a, b) => a.start.valueOf() - b.start.valueOf());

    const laneLastEnd: Dayjs[] = [];
    const placed: LaidOutEvent[] = [];

    for (const item of normalized) {
      let laneIndex = 0;

      while (
        laneIndex < laneLastEnd.length &&
        laneLastEnd[laneIndex].isSameOrAfter(item.start, 'day')
      ) {
        laneIndex++;
      }

      laneLastEnd[laneIndex] = item.end;
      placed.push({
        ...item.ev,
        lane: laneIndex,
      });
    }

    return { placed, maxLane: laneLastEnd.length || 1 };
  }

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
          {weeks.map((row, wIdx) => {
            const weekDates = row.map((cell) => dayjs(cell.ymd));
            const weekStart = weekDates[0];
            const weekEnd = weekDates[weekDates.length - 1];

            const weekEvents = calendar.filter((ev) => {
              const start = dayjs(ev.startDate);
              const end = dayjs(ev.endDate ?? ev.startDate);
              return (
                end.isSameOrAfter(weekStart, 'day') &&
                start.isSameOrBefore(weekEnd, 'day')
              );
            });

            const { placed, maxLane } = layoutWeekEvents(
              weekEvents,
              weekStart,
              weekEnd
            );

            return (
              <div
                key={wIdx}
                className={styles.calendar_body_line}
                style={{
                  paddingBottom: `${maxLane * 24}px`,
                }}
              >
                {row.map((cell: CalendarCell, idx: number) => (
                  <div className={styles.calendar_body_days} key={cell.ymd}>
                    <span
                      className={styles.date_num}
                      style={cellColor(cell.date, idx, cell.isOtherMonth)}
                    >
                      {cell.dayLabel}
                    </span>
                  </div>
                ))}

                <div className={styles.week_events}>
                  {placed.map((ev) => (
                    <EventBar
                      key={ev.id}
                      ev={ev}
                      weekStart={weekStart}
                      weekEnd={weekEnd}
                      index={ev.lane}
                    />
                  ))}
                </div>
              </div>
            );
          })}
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
