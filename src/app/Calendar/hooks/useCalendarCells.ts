// hooks/useCalendarCells.ts
import { useMemo } from "react";
import moment from "moment";

export type CalendarCell = {
  date: moment.Moment;
  ymd: string;
  dayLabel: string;
  isToday: boolean;
  isOtherMonth: boolean;
};

export function useCalendarCells(current: moment.Moment) {
  return useMemo(() => {
    const start = current.clone().startOf("month").startOf("week");
    const end   = current.clone().endOf("month").endOf("week");
    const rows: any[] = [];
    let week: any[] = [];
    const todayStr = moment().format("YYYYMMDD");
    const monthStr = current.format("MM");
    for (let d = start.clone(); d.isSameOrBefore(end, "day"); d.add(1, "day")) {
      week.push({
        date: d.clone(),
        ymd: d.format("YYYYMMDD"),
        dayLabel: d.format("D"),
        isToday: d.format("YYYYMMDD") === todayStr,
        isOtherMonth: d.format("MM") !== monthStr,
      });
      if (week.length === 7) { rows.push(week); week = []; }
    }
    return rows;
  }, [current]);
}
