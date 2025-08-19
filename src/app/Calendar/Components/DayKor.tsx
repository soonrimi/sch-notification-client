import type { ReactElement } from "react";
import styles from "./styles.module.css";

export default function DayKor(): ReactElement {
  const days = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <div className={styles.calendar_sun_to_mon}>
      {days.map((day, idx) => (
        <div
          key={day}
          style={{
            color:
              idx === 0
                ? "#FF6060" // 일요일
                : idx === 6
                ? "#D5B829" // 토요일
                : undefined,
            paddingBottom: "8px",
            fontWeight: "bold"
          }}
        >
          {day}
        </div>
      ))}
    </div>
  );
}
