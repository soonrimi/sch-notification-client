import dayjs, { Dayjs } from 'dayjs';
import styles from './styles.module.css';
import { CalenderDto_Response } from '@/api/models/CalenderDto_Response';

interface EventBarProps {
  ev: CalenderDto_Response;
  weekStart: Dayjs;
  weekEnd: Dayjs;
  index?: number;
}

export default function EventBar({
  ev,
  weekStart,
  weekEnd,
  index = 0,
}: EventBarProps) {
  const start = dayjs(ev.startDate);
  const end = dayjs(ev.endDate ?? ev.startDate);

  const startCol = Math.max(1, start.diff(weekStart, 'day') + 1);
  const endCol = Math.min(8, end.diff(weekStart, 'day') + 2);

  const thisMonthEventColors: Record<string, string> = {
    holiday: '#FF9999',
    general: '#ADE4B2',
    registration: '#F4CDAC',
    grading: '#FFDF99',
    course_registration: '#A5D7EF',
    tuition: '#D1A4F3',
    etc: '#B1B1B1',
  };

  const category = ev.type ?? 'etc';
  const bgColor = thisMonthEventColors[category] ?? '#B1B1B1';

  return (
    <div
      className={styles.event_bar}
      style={{
        gridColumn: `${startCol} / ${endCol}`,
        gridRow: index + 1,
        backgroundColor: bgColor,
      }}
      title={`${ev.title ?? ''} (${start.format('M/D')}~${end.format('M/D')})`}
    >
      {ev.title}
    </div>
  );
}
