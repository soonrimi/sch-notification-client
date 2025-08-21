'use client';

import {
  Container,
  IconButton,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
} from '@mui/material';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './page.module.css';
import { DEPARTMENT_LIST, GRADE_LIST } from '@/constants/gradeDepart';

type Major = { name: string; grade: string };
type Profile = { majors: Major[]; appVersion: string };

const STORAGE_KEY = 'userProfile';

// 가나다+학년(1→4) 정렬
const gradeRank: Record<string, number> = {
  '1학년': 1,
  '2학년': 2,
  '3학년': 3,
  '4학년': 4,
};
const sortMajors = (arr: Major[]) =>
  [...arr].sort(
    (a, b) =>
      a.name.localeCompare(b.name, 'ko') ||
      (gradeRank[a.grade] ?? 99) - (gradeRank[b.grade] ?? 99)
  );

export default function EditUserInfoPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile>({
    majors: [
      { name: '컴퓨터소프트웨어공학과', grade: '3학년' },
      { name: '사물인터넷학과', grade: '4학년' },
    ],
    appVersion: '11.1.1',
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Profile;
        if (Array.isArray(parsed.majors) && parsed.majors.length > 0) {
          setProfile(parsed);
        }
      }
    } catch {}
  }, []);

  const updateMajorName = (idx: number, value: string) => {
    setProfile((prev) => {
      const majors = [...prev.majors];
      majors[idx] = { ...majors[idx], name: value };
      return { ...prev, majors };
    });
  };

  const updateMajorGrade = (idx: number, value: string) => {
    setProfile((prev) => {
      const majors = [...prev.majors];
      majors[idx] = { ...majors[idx], grade: value };
      return { ...prev, majors };
    });
  };

  const addRow = () =>
    setProfile((prev) => ({
      ...prev,
      majors: [...prev.majors, { name: '', grade: '' }],
    }));

  const removeRow = (idx: number) =>
    setProfile((prev) => ({
      ...prev,
      majors: prev.majors.filter((_, i) => i !== idx),
    }));

  const onSave = () => {
    const cleaned = profile.majors
      .map((m) => ({ name: m.name.trim(), grade: m.grade.trim() }))
      .filter((m) => m.name && m.grade);

    const next: Profile = { ...profile, majors: sortMajors(cleaned) };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    router.push('/settings');
  };

  return (
    <Container maxWidth="sm" className={styles.container}>
      {/* 헤더 */}
      <div className={styles.header}>
        <IconButton
          size="small"
          onClick={() => router.back()}
          className={styles.backBtn}
        >
          <ArrowBackIosNewRoundedIcon fontSize="small" />
        </IconButton>
        <h1 className={styles.title}>사용자 정보 수정</h1>
      </div>

      {/* 행 리스트 */}
      <div className={styles.rows}>
        {profile.majors.map((m, idx) => (
          <Paper key={`row-${idx}`} className={styles.row} variant="outlined">
            {/* 학과(좌) */}
            <FormControl size="small" className={styles.formMajor}>
              <InputLabel className={styles.inputLabel}>학과</InputLabel>
              <Select
                value={m.name}
                label="학과"
                onChange={(e) => updateMajorName(idx, e.target.value)}
                className={styles.select}
                MenuProps={{ PaperProps: { className: styles.menuPaper } }}
              >
                {DEPARTMENT_LIST.map((dept) => (
                  <MenuItem key={dept} value={dept} className={styles.menuItem}>
                    {dept}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* 학년(우) */}
            <FormControl size="small" className={styles.formGrade}>
              <InputLabel className={styles.inputLabel}>학년</InputLabel>
              <Select
                value={m.grade}
                label="학년"
                onChange={(e) => updateMajorGrade(idx, e.target.value)}
                className={styles.select}
              >
                {GRADE_LIST.map((g) => (
                  <MenuItem key={g} value={g} className={styles.menuItemBold}>
                    {g}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <IconButton
              aria-label="row-delete"
              onClick={() => removeRow(idx)}
              className={styles.deleteBtn}
              color="error"
              size="small"
            >
              <DeleteOutlineIcon />
            </IconButton>
          </Paper>
        ))}

        <Button
          startIcon={<AddIcon />}
          variant="outlined"
          onClick={addRow}
          className={styles.addRowBtn}
        >
          행 추가
        </Button>
      </div>

      {/* 하단 고정 버튼 */}
      <div className={styles.footer}>
        <Container maxWidth="sm" className={styles.footerInner}>
          <Button fullWidth variant="outlined" onClick={() => router.back()}>
            취소
          </Button>
          <Button fullWidth variant="contained" onClick={onSave}>
            저장
          </Button>
        </Container>
      </div>
    </Container>
  );
}
