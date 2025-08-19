'use client';

import {
  Container,
  Paper,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Divider,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './page.module.css';

type Major = { name: string; grade: string };
type Profile = { majors: Major[]; appVersion: string };

const STORAGE_KEY = 'userProfile';

// 가나다 + 학년(1→4) 정렬
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

export default function SettingsPage() {
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
          setProfile({ ...parsed, majors: sortMajors(parsed.majors) });
        }
      }
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <Container maxWidth="sm" className={styles.container}>
      {/* 헤더 */}
      <div className={styles.header}>
        <IconButton
          size="small"
          className={styles.backBtn}
          onClick={() => router.back()}
        >
          <ArrowBackIosNewRoundedIcon fontSize="small" />
        </IconButton>
        <h1 className={styles.headerTitle}>설정</h1>
      </div>

      {/* 사용자 정보 카드 */}
      <Paper variant="outlined" className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>사용자 정보</h2>
          <IconButton
            size="small"
            className={styles.editBtn}
            onClick={() => router.push('/settings/edit')}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </div>

        {/* 표 */}
        <div className={styles.table}>
          <div className={`${styles.row} ${styles.headerRow}`}>
            <span
              className={`${styles.col} ${styles.colMajor} ${styles.headerText}`}
            >
              학과
            </span>
            <span
              className={`${styles.col} ${styles.colGrade} ${styles.headerText}`}
            >
              학년
            </span>
          </div>

          {profile.majors.map((m, i) => (
            <div key={`${m.name}-${i}`} className={styles.row}>
              <span
                className={`${styles.col} ${styles.colMajor} ${styles.majorText}`}
              >
                {m.name || '—'}
              </span>
              <span
                className={`${styles.col} ${styles.colGrade} ${styles.gradeText}`}
              >
                {m.grade || '—'}
              </span>
            </div>
          ))}
        </div>
      </Paper>

      {/* 맞춤 설정 */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>맞춤 설정</h3>
        <List className={styles.list}>
          <ListItemButton onClick={() => alert('관심 키워드 관리 (추가 예정)')}>
            <ListItemText
              primary="관심 키워드 관리"
              slotProps={{ primary: { className: styles.listItemText } }}
            />
          </ListItemButton>
        </List>
      </section>

      {/* 기타 */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>기타</h3>
        <List className={styles.list}>
          <ListItemButton onClick={() => router.push('/feedback')}>
            <ListItemText
              primary="건의하기"
              slotProps={{ primary: { className: styles.listItemText } }}
            />
          </ListItemButton>
          <Divider />
          <div className={styles.version}>
            <span className={styles.versionLabel}>앱 버전</span>
            <span className={styles.versionValue}>{profile.appVersion}</span>
          </div>
        </List>
      </section>
    </Container>
  );
}
