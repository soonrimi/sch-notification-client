'use client';
import { useState, useEffect } from 'react';
import Layout from '@/Components/LayoutDir/Layout';
import styles from './page.module.css';

export default function KeywordSettings() {
  const [include, setInclude] = useState<string[]>([]);
  const [exclude, setExclude] = useState<string[]>([]);
  const [includeInput, setIncludeInput] = useState('');
  const [excludeInput, setExcludeInput] = useState('');

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('keywords') || '{}');
    setInclude(saved.include || []);
    setExclude(saved.exclude || []);
  }, []);

  const save = (newInclude: string[], newExclude: string[]) => {
    localStorage.setItem(
      'keywords',
      JSON.stringify({ include: newInclude, exclude: newExclude })
    );
    setInclude(newInclude);
    setExclude(newExclude);
  };

  const addInclude = (value: string) => {
    if (!value.trim()) return;
    if (include.includes(value.trim())) return;
    save([...include, value.trim()], exclude);
    setIncludeInput('');
  };

  const addExclude = (value: string) => {
    if (!value.trim()) return;
    if (exclude.includes(value.trim())) return;
    save(include, [...exclude, value.trim()]);
    setExcludeInput('');
  };

  const resetInclude = () => save([], exclude);
  const resetExclude = () => save(include, []);

  return (
    <Layout
      headerProps={{
        pageType: 'settings',
        settingsHeaderProps: {
          title: '키워드 알림 설정',
          backgroundColor: '#F7F7F7',
        },
      }}
      hideBottomNav
      backgroundColor="#F7F7F7"
      fullHeight
    >
      <div className={styles.container}>
        {/* 포함 키워드 */}
        <div className={styles.includeBox}>
          <div className={styles.headerRow}>
            <span className={styles.secondTitle}>포함</span>
            <button className={styles.resetBtn} onClick={resetInclude}>
              초기화
            </button>
          </div>
          <div className={styles.inputRow}>
            <input
              className={styles.input}
              placeholder="알림 받을 키워드를 입력해주세요"
              value={includeInput}
              onChange={(e) => setIncludeInput(e.target.value)}
            />
            <button
              className={styles.btn}
              onClick={() => addInclude(includeInput)}
            >
              등록
            </button>
          </div>
          <div className={styles.Instruction}>
            키워드가 포함된 공지는 카테고리 알림이 꺼져 있어도 알림을 전송해요.
          </div>
          <div className={styles.keywordRow}>
            {include.length > 0 &&
              include.map((kw, idx) => (
                <span key={idx} className={styles.chip}>
                  {kw}
                  <span
                    className={styles.chipDeleteIcon}
                    onClick={() =>
                      save(
                        include.filter((k) => k !== kw),
                        exclude
                      )
                    }
                  >
                    ✕
                  </span>
                </span>
              ))}
          </div>
        </div>

        {/* 제외 키워드 */}
        <div>
          <div className={styles.headerRow}>
            <span className={styles.secondTitle}>제외</span>
            <button className={styles.resetBtn} onClick={resetExclude}>
              초기화
            </button>
          </div>
          <div className={styles.inputRow}>
            <input
              className={styles.input}
              placeholder="제외할 키워드를 입력해주세요."
              value={excludeInput}
              onChange={(e) => setExcludeInput(e.target.value)}
            />
            <button
              className={styles.btn}
              onClick={() => addExclude(excludeInput)}
            >
              등록
            </button>
          </div>
          <div className={styles.Instruction}>
            제외 키워드가 하나라도 포함된 공지는 알림을 보내지 않아요.
          </div>
          <div className={styles.keywordRow}>
            {exclude.length > 0 &&
              exclude.map((kw, idx) => (
                <span key={idx} className={styles.chip}>
                  {kw}
                  <span
                    className={styles.chipDeleteIcon}
                    onClick={() =>
                      save(
                        include,
                        exclude.filter((k) => k !== kw)
                      )
                    }
                  >
                    ✕
                  </span>
                </span>
              ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
