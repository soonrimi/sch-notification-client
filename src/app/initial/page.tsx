'use client';

import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from './page.module.css';
import type { Major } from '@/types/profile';
import Grade from './Components/Grade';
import Department from './Components/Department';

const STORAGE_KEY = 'soonrimi';

export default function InitialSetup() {
  const { push } = useRouter();
  const [majors, setMajors] = useState<Major[]>([]);
  const [grade, setGrade] = useState('');

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const restored: Major[] = Array.isArray(parsed?.majors)
        ? parsed.majors
        : [];
      setMajors(restored);

      if (restored.length > 0) {
        push('/home');
      }
    }
  }, [push]);

  // 새로운 학과/학년 추가
  const existsMajor = (name: string, grade: string, list: Major[]) =>
    list.some((m) => m.name === name && m.grade === grade);

  const addMajor = (name: string, grade: string) => {
    setMajors((prev) => {
      if (existsMajor(name, grade, prev)) {
        alert('이미 선택한 학년/학과입니다.');
        return prev;
      }
      return [...prev, { name, grade }];
    });
  };

  // 선택한 학과/학년 삭제
  const removeMajor = (idx: number) => {
    setMajors((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleStart = () => {
    if (majors.length === 0) {
      alert('학년/학과를 최소 1개 이상 선택해주세요.');
      return;
    }
    const payload = {
      majors,
      createdAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    push('/home');
  };

  return (
    <div className={styles.App}>
      <div className={styles.title}>내 정보 등록</div>
      <div className={styles.body}>
        {/* 선택된 학년, 학과 */}
        <div className={styles.tag}>
          {hydrated &&
            majors.map(
              (m, idx) =>
                m.name &&
                m.grade && (
                  <span key={idx} className={styles.selectedTag}>
                    {m.name}, {m.grade}
                    <button
                      className={styles.removeBtn}
                      onClick={() => removeMajor(idx)}
                    >
                      ✕
                    </button>
                  </span>
                )
            )}
        </div>
        {/* 학년 선택창 */}
        <div className={styles.gradeSetup}>
          <Grade grade={grade} setGrade={setGrade} />
        </div>
        {/* 학과 검색창 */}
        <div className={styles.departmentSetup}>
          <Department
            setDepartment={(dept) => {
              if (grade) {
                addMajor(dept, grade);
                setGrade('');
              }
            }}
          />
        </div>
      </div>
      <div className={styles.start}>
        <Button
          fullWidth
          variant="contained"
          onClick={handleStart}
          className={styles.startbtn}
        >
          시작하기
        </Button>
      </div>
    </div>
  );
}
