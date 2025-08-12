'use client'
import styles from "./page.module.css";
import HomeHeader from './HomeHeader';
import HomeHeaderCategorys from "./HomeHeaderCategorys";
import HomeContent from './HomeContent';
import BottomNav from './BottomNav';

export default function NoticeList() {
  return (
    <div className={styles.home_container}>
      <div className={styles.home_header_position}>
        <HomeHeader />
        <HomeHeaderCategorys />
      </div>
      <div className={styles.home_content_position}>
        <HomeContent />
      </div>
      <div>
        <BottomNav />
      </div>
    </div>
  );
}