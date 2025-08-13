import { useMemo } from "react";
import dayjs, {Dayjs} from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

export type CalendarCell = {
  date: Dayjs;
  ymd: string;
  dayLabel: string;
  isToday: boolean;
  isOtherMonth: boolean;
};

//current: 현재 화면에서 보고 있는 달
export default function useCalendarCells(current: Dayjs): CalendarCell[][]{
  return useMemo(() => {
    const currentMonth = current.format("MM");
    const now = dayjs().format("YYYYMMDD"); //오늘

    //현재 보고있는 달 범위
    const monthStart=current.startOf("month");
    const monthEnd=current.endOf("month");

    let rangeStart=monthStart;
    rangeStart=rangeStart.startOf("week")

    let rangeEnd=monthEnd;
    rangeEnd=rangeEnd.endOf("week");

    const rows: any[] = [];
    let week: any[] = [];

    for (let d = rangeStart; d.isSameOrBefore(rangeEnd, "day");d=d.add(1, "day")) {
      week.push({
        date: d,
        ymd: d.format("YYYYMMDD"),
        dayLabel: d.format("D"),
        isToday: d.format("YYYYMMDD") === now,
        isOtherMonth: d.format("MM") !== currentMonth,
      });
      if (week.length === 7) { rows.push(week); week = []; }
    }
    return rows;
  }, [current]);
}
