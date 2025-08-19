import type { CalendarEvent } from '@/types/calendar'
import styles from './styles.module.css'

interface EventItemProps {
  event: CalendarEvent;
}

export default function EventItem({ event }: EventItemProps) {
  const thisMonthEventColors: Record<string, string> = {
    holiday: '#FF9999',
    academic: '#A5D7EF',
    evaluation: '#D1A4F3',
    seasonal: '#FFDF99',
    etc: '#B1B1B1',
  };

  const category = event.category ?? 'etc';
  const bgColor = thisMonthEventColors[category];

  return (
    <div className={styles.event_item} style={{ backgroundColor: bgColor }}>
      {event.title}
    </div>
  );
}
