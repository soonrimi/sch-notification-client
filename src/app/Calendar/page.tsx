'use client';

import { useState } from 'react';
import type { ReactElement } from 'react';
import moment from 'moment';
import styles from './page.module.css';
import { useMonthNavigation } from './hooks/useMonthNavigation';
import { useCalendarCells, CalendarCell } from './hooks/useCalendarCells';
import Layout from '@/components/Layout/Layout';

const Calendar = () => {
  const [current, setCurrent] = useState<moment.Moment>(moment());
  const nav = useMonthNavigation(setCurrent, {
    wheelThreshold: 100,
    swipeThreshold: 40,
    cooldownMs: 250,
  });

  const weeks = useCalendarCells(current);

  return (
    <Layout pageType="calendar">
      <div className={styles.App}>
        <div className={styles.calendar_head}>
          <div>{current.format('M월')}</div>
        </div>

        <div
          className={styles.calendar_body}
          tabIndex={0}
          style={{ outline: 'none' }}
          onWheel={nav.onWheel}
          onTouchStart={nav.onTouchStart}
          onTouchMove={nav.onTouchMove}
          onTouchEnd={nav.onTouchEnd}
          onKeyDown={nav.onKeyDown}
        >
          <div className={styles.calendar_body_box}>
            <DayKor />
            {weeks.map((row: CalendarCell[], wIdx: number) => (
              <div className={styles.calendar_body_line} key={wIdx}>
                {row.map((cell, idx) => (
                  <div className={styles.calendar_body_days_box}>
                    <div
                      className={styles.calendar_body_days}
                      key={cell.ymd}
                      onClick={() => console.log(cell.ymd)}
                    >
                      <span
                        style={{
                          ...(cell.isToday
                            ? {
                                backgroundColor: 'black',
                                color: 'white',
                                borderRadius: '6px',
                                padding: '2px 6px',
                                display: 'inline-block',
                                fontWeight: 'bold',
                              }
                            : idx === 0 && cell.isOtherMonth
                              ? { color: '#FFADAD' }
                              : idx === 6 && cell.isOtherMonth
                                ? { color: '#E6D47F' }
                                : cell.isOtherMonth
                                  ? { color: '#b1b1b1' }
                                  : idx === 0
                                    ? { color: '#FF6060', fontWeight: 'bold' } // 일요일
                                    : idx === 6
                                      ? { color: '#D5B829', fontWeight: 'bold' } // 토요일
                                      : { fontWeight: 'bold' }),
                        }}
                      >
                        {cell.dayLabel}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Calendar;

function DayKor(): ReactElement {
  const days = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div className={styles.calendar_body_head}>
      {days.map((day, idx) => (
        <div
          key={day}
          style={{
            color:
              idx === 0
                ? '#FF6060' // 일요일
                : idx === 6
                  ? '#D5B829' // 토요일
                  : undefined,
            paddingBottom: '8px',
            fontWeight: 'bold',
          }}
        >
          {day}
        </div>
      ))}
    </div>
  );
}
