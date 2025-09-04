import styles from './styles.module.css';
import { CalenderDto_Response } from '@/api';

interface EventItemProps {
  event: CalenderDto_Response;
}

export default function EventItem({ event }: EventItemProps) {
  const thisMonthEventColors: Record<string, string> = {
    holiday: '#FF9999',
    general: '#ade4b2ff',
    registration: '#',
    grading: '#FFDF99',
    course_registration: '#A5D7EF',
    tuition: '#D1A4F3',
    etc: '#B1B1B1',
  };

  const category = event.type ?? 'etc';
  const bgColor = thisMonthEventColors[category];

  return (
    <div className={styles.event_item} style={{ backgroundColor: bgColor }}>
      {event.title}
    </div>
  );
}
