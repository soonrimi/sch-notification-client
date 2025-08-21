export type CalendarCategory =
  | 'holiday' // 공휴일 및 휴무
  | 'academic' // 수강신청, 휴학/복학, 전공변경, 졸업신청 등 모든 학사 행정
  | 'evaluation' // 시험, 수업평가, 성적관련
  | 'seasonal' // 하계/동계 학기
  | 'etc'; // 기타 (입학식, 개강일, 행사 등)

export interface CalendarEvent {
  id: number;
  title: string;
  start: string;
  end: string;
  allDay?: boolean;
  color?: string;
  category?: CalendarCategory;
}
