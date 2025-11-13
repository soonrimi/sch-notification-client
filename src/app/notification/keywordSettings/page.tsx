'use client';
import { useState, useEffect } from 'react';
import Layout from '@/Components/LayoutDir/Layout';
import styles from './page.module.css';
import { KeywordControllerService } from '@/api/services/KeywordControllerService';

export default function KeywordSettings() {
  const [include, setInclude] = useState<string[]>([]);
  const [exclude, setExclude] = useState<string[]>([]);
  const [includeInput, setIncludeInput] = useState('');
  const [excludeInput, setExcludeInput] = useState('');
  const [keywordId, setKeyWordId] = useState<number | null>(1);
  // const [keywordId, setKeyWordId] = useState<number | null>(null);

  useEffect(() => {
    const cached = JSON.parse(localStorage.getItem('keywords') || '{}');
    setInclude(cached.include || []);
    setExclude(cached.exclude || []);

    const init = async () => {
      try {
        let deviceId = localStorage.getItem('device_id');
        if (!deviceId) {
          console.warn('device_id가 없습니다.');
          return;
        }

        //TODO: 백엔드 수정후 주석 제거
        // // let myKeyword = await KeywordControllerService.getByDeviceId(deviceId);

        // // if (!myKeyword) {
        // //   myKeyword = await KeywordControllerService.create2({
        // //     device_id: deviceId,
        // //     include: [],
        // //     exclude: [],
        // //   } as any);
        // // }

        // setKeyWordId(myKeyword.id);
        // setInclude(myKeyword.include || []);
        // setExclude(myKeyword.exclude || []);

        // localStorage.setItem(
        //   'keywords',
        //   JSON.stringify({ include: myKeyword.include, exclude: myKeyword.exclude })
        // );
      } catch (err) {
        console.error('키워드 설정 불러오기 실패:', err);
      }
    };

    init();
  }, []);

  const save = async (newInclude: string[], newExclude: string[]) => {
    localStorage.setItem(
      'keywords',
      JSON.stringify({ include: newInclude, exclude: newExclude })
    );

    if (!keywordId) return;
    try {
      await KeywordControllerService.update2(keywordId, {
        include: newInclude,
        exclude: newExclude,
      } as any);
      setInclude(newInclude);
      setExclude(newExclude);
    } catch (err) {
      console.error('키워드 저장 실패:', err);
    }
  };

  const addInclude = async (value: string) => {
    if (!value.trim() || include.includes(value.trim()) || !keywordId) return;
    const newInclude = [...include, value.trim()];

    localStorage.setItem(
      'keywords',
      JSON.stringify({ include: newInclude, exclude })
    );
    setInclude(newInclude);
    setIncludeInput('');

    try {
      await KeywordControllerService.patchInclude(keywordId, newInclude);
      setInclude(newInclude);
      setIncludeInput('');
    } catch (err) {
      console.error('포함 키워드 추가 실패:', err);
    }
  };

  const addExclude = async (value: string) => {
    if (!value.trim() || exclude.includes(value.trim()) || !keywordId) return;
    const newExclude = [...exclude, value.trim()];

    localStorage.setItem(
      'keywords',
      JSON.stringify({ include, exclude: newExclude })
    );
    setExclude(newExclude);
    setExcludeInput('');

    try {
      await KeywordControllerService.patchExclude(keywordId, newExclude);
    } catch (err) {
      console.error('제외 키워드 추가 실패:', err);
    }
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
