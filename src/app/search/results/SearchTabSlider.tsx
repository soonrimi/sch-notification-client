'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './SearchTabSlider.module.css';

type TabType = 'home' | 'bookmark' | 'calendar';

interface SearchTabSliderProps {
  initialTab?: TabType;
  scope?: string | null;
  keyword?: string;
  onTabChange?: (tabId: TabType) => void;
}

export default function SearchTabSlider({
  initialTab,
  scope,
  keyword,
  onTabChange,
}: SearchTabSliderProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    if (scope === 'bookmark') return 'bookmark';
    if (scope === 'calendar') return 'calendar';
    return initialTab || 'home';
  });
  const sliderRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const tabs: { id: TabType; label: string }[] = [
    { id: 'home', label: '홈' },
    { id: 'bookmark', label: '북마크' },
    { id: 'calendar', label: '캘린더' },
  ];

  useEffect(() => {
    if (scope === 'bookmark') {
      setActiveTab('bookmark');
    } else if (scope === 'calendar') {
      setActiveTab('calendar');
    } else {
      // scope가 없거나 'all'이 아니면 홈 탭 선택
      setActiveTab('home');
    }
  }, [scope]);

  useEffect(() => {
    const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);
    const activeButton = tabsRef.current[activeIndex];

    if (activeButton && sliderRef.current) {
      const buttonRect = activeButton.getBoundingClientRect();
      const containerRect = activeButton.parentElement?.getBoundingClientRect();

      if (containerRect) {
        const left = buttonRect.left - containerRect.left;
        const width = buttonRect.width;

        sliderRef.current.style.transform = `translateX(${left}px)`;
        sliderRef.current.style.width = `${width}px`;
      }
    }
  }, [activeTab]);

  const handleTabClick = (tabId: TabType) => {
    // 탭 상태 업데이트 (슬라이더 인디케이터 이동)
    setActiveTab(tabId);
    
    // URL 업데이트 (캘린더 포함)
    if (keyword) {
      const newScope = tabId === 'home' ? undefined : tabId;
      const queryParams = new URLSearchParams();
      queryParams.set('keyword', keyword);
      if (newScope) {
        queryParams.set('scope', newScope);
      }
      router.push(`/search/results?${queryParams.toString()}`);
    }
    
    // 캘린더 탭은 콜백 호출하지 않음 (다른 팀원이 구현 예정)
    if (tabId === 'calendar') {
      return;
    }
    
    // 콜백 함수 호출
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  return (
    <div className={styles.slider_container}>
      <div className={styles.slider_track}>
        <div ref={sliderRef} className={styles.slider_indicator} />
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(el) => {
              tabsRef.current[index] = el;
            }}
            className={`${styles.slider_tab} ${
              activeTab === tab.id ? styles.slider_tab_active : ''
            }`}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

