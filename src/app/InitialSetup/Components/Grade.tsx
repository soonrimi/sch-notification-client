'use client';

import { useState } from 'react';
import styles from './styles.module.css';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMore';
import type { Major } from '@/types/profile';
import { GRADE_LIST } from '@/constants/gradeDepart';

type GradeProps = {
  grade: Major['grade'];
  setGrade: (value: Major['grade']) => void;
};

export default function Grade({ grade, setGrade }: GradeProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (value: string) => {
    setGrade(value);
    setOpen(false);
  };

  return (
    <div className={styles.dropdown}>
      <div className={styles.grade_department_headerText}>학년</div>
      <div className={styles.selected} onClick={() => setOpen((prev) => !prev)}>
        {grade ? (
          <span>{grade}</span>
        ) : (
          <span className={styles.gradePlaceholder}>학년을 선택하세요.</span>
        )}
        <span>
          {!open && (
            <ExpandMoreOutlinedIcon
              sx={{ fontSize: '1.8rem', color: '#9f9f9f' }}
            />
          )}
        </span>
      </div>

      {open && (
        <div className={styles.gradeList}>
          {GRADE_LIST.map((g) => (
            <div
              key={g}
              className={`${styles.option} ${grade === g ? styles.active : ''}`}
              onClick={() => handleSelect(g)}
            >
              {g}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
