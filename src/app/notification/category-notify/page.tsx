'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';
import Layout from '@/Components/LayoutDir/Layout';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';

interface Major {
  name: string;
  grade: string;
}

interface UserProfile {
  majors: Major[];
}

export default function CategorySettings() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('userProfile');
    if (stored) {
      try {
        setUserProfile(JSON.parse(stored));
      } catch (e) {
        console.error('userProfile 파싱 실패:', e);
      }
    }
  }, []);

  return (
    <Layout
      headerProps={{
        pageType: 'settings',
        settingsHeaderProps: { title: '카테고리 알림 설정' },
      }}
      hideBottomNav
      backgroundColor="#F7F7F7"
      fullHeight
    >
      <div className={styles.container}>
        <p className={styles.subtitle}>
          원하는 카테고리의 공지를 알림으로 받아보세요.
        </p>

        <CategoryCard>
          <CategoryToggle label="대학" defaultOn />
        </CategoryCard>

        {userProfile?.majors.map((major, idx) => (
          <MajorDropdown key={idx} major={major} />
        ))}

        <CategoryCard>
          <CategoryToggle label="채용" defaultOn />
        </CategoryCard>

        <CategoryCard>
          <CategoryToggle label="활동" defaultOn />
        </CategoryCard>
      </div>
    </Layout>
  );
}

function MajorDropdown({ major }: { major: Major }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.categoryBox}>
      <div className={styles.majorHeader} onClick={() => setOpen(!open)}>
        <span className={styles.majorTitle}>
          {major.name} {major.grade}
        </span>
        {open ? (
          <ExpandLessIcon className={styles.arrowBtn} />
        ) : (
          <ExpandMoreIcon className={styles.arrowBtn} />
        )}
      </div>

      {open && (
        <div className={styles.dropdown}>
          <CategoryToggle label="학년" defaultOn />
          <CategoryToggle label="학과" defaultOn />
        </div>
      )}
    </div>
  );
}

function CategoryCard({ children }: { children: React.ReactNode }) {
  return <div className={styles.categoryBox}>{children}</div>;
}

function CategoryToggle({
  label,
  defaultOn = false,
}: {
  label: string;
  defaultOn?: boolean;
}) {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('notify_categories') || '{}');
    if (saved[label] !== undefined) {
      setChecked(saved[label]);
    }
  }, [label]);

  const handleToggle = () => {
    const newValue = !checked;
    setChecked(newValue);

    const saved = JSON.parse(localStorage.getItem('notify_categories') || '{}');

    if (newValue) {
      saved[label] = true;
    } else {
      delete saved[label];
    }

    localStorage.setItem('notify_categories', JSON.stringify(saved));
  };

  return (
    <label className={styles.toggleRow} onClick={handleToggle}>
      <span>{label}</span>
      {checked ? (
        <ToggleOnIcon sx={{ color: '#3182F6', fontSize: '2rem' }} />
      ) : (
        <ToggleOffIcon sx={{ color: '#50545F', fontSize: '2rem' }} />
      )}
    </label>
  );
}
