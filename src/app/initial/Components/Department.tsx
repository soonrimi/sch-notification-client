'use client';

import { useState } from 'react';
import styles from './styles.module.css';
import { DEPARTMENT_LIST } from '@/constants/gradeDepart';
import type { Major } from '@/types/profile';
import SearchIcon from '@mui/icons-material/Search';

type DepartmentProps = {
  setDepartment: (value: Major['name']) => void;
};

export default function Department({ setDepartment }: DepartmentProps) {
  const [query, setQuery] = useState('');

  const filtered = query
    ? DEPARTMENT_LIST.filter((dept) => dept.includes(query))
    : DEPARTMENT_LIST;

  return (
    <div className={styles.wrapper}>
      <div className={styles.grade_department_headerText}>학과</div>
      <div className={styles.searchBox}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="학과 이름을 검색하세요."
          className={styles.input}
        />
        <SearchIcon className={styles.searchIcon} />
      </div>
      <div className={styles.list}>
        {filtered.length > 0 ? (
          filtered.map((dept) => (
            <div
              key={dept}
              className={styles.item}
              onClick={() => {
                if (setDepartment) {
                  setDepartment(dept);
                }
                setQuery('');
              }}
            >
              {dept}
            </div>
          ))
        ) : (
          <div className={styles.noResult}>검색 결과 없음</div>
        )}
      </div>
    </div>
  );
}
