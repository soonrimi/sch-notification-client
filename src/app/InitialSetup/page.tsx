'use client';

import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './page.module.css';
import type { Major } from '@/types/profile';
import Grade from './Components/Grade';
import Department from './Components/Department';
//Todo: 백엔드 연결 후 주석 해제
// import { saveUserInfo } from '@/api/saveUserInfo';

export default function InitialSetup() {
  const [grade, setGrade] = useState('');

  const [majors, setMajors] = useState<Major[]>([]);
  // 새로운 학과/학년 추가
  const addMajor = (name: string, grade: string) => {
    setMajors((prev) => [...prev, { name, grade }]);
  };
  // 선택한 학과/학년 삭제
  const removeMajor = (idx: number) => {
    setMajors((prev) => prev.filter((_, i) => i !== idx));
  };

  //Todo: 백엔드 연결 후 주석 해제
  // const handleStart = async () => {
  //   try {
  //     await saveUserInfo(majors);
  //     console.log('저장 성공!');
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const { push } = useRouter();
  const handleGoToHome = () => {
    push('/Home');
  };

  return (
    <div className={styles.App}>
      <div className={styles.title}>내 정보 등록</div>
      <div className={styles.body}>
        {/* 선택된 학년, 학과 */}
        <div className={styles.tag}>
          {majors.map(
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
          onClick={() => {
            handleGoToHome();
            //Todo: 백엔드 연결 후 주석 해제
            // handleStart();
          }}
          className={styles.startbtn}
        >
          시작하기
        </Button>
      </div>
    </div>
  );
}
