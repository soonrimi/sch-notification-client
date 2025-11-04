'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './SearchTabSlider.module.css';

type TabType = 'home' | 'bookmark' | 'calendar';

interface SearchTabSliderProps {
  initialTab?: TabType;
  scope?: string | null;
}

export default function SearchTabSlider({
  initialTab,
  scope,
}: SearchTabSliderProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>(
    scope === 'bookmark' ? 'bookmark' : initialTab || 'home'
  );
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
    setActiveTab(tabId);
    // 여기서 라우팅 로직 추가 가능
    // 예: router.push(`/search/results?scope=${tabId}`);
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

