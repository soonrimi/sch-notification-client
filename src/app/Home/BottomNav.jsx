"use client"
import React from 'react';
import Image from 'next/image';
import styles from '../page.module.css'
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav () {
  const pathname = usePathname();

  return (
    <div className={styles.bottomnav}>
      <Link href='/Home' className={styles.bottomnav_home}>
        <Image
          className={styles.bottomnav_home_icon}
          src={pathname === "/Home" ? "/icons/active_home_icon.png" : "/icons/home_icon.png"}
          alt='홈'
          width={28}
          height={28}
        />
        <span className={`${styles.bottomnav_home_text} ${pathname === "/Home" ? styles.active_text : ""}`}>홈</span>
      </Link>

      <Link href='/Bookmark' className={styles.bottomnav_bookmark}>
        <Image
          className={styles.bottomnav_bookmark_icon}
          src={pathname === "/Bookmark" ? "/icons/active_nav_bookmark_icon.png" : "/icons/nav_bookmark_icon.png"}
          alt='북마크'
          width={16}
          height={21}
        />
        <span className={`${styles.bottomnav_bookmark_text} ${pathname === "/Bookmark" ? styles.active_text : ""}`}>북마크</span>
      </Link>

      <Link href='/Alarm' className={styles.bottomnav_alarm}>
        <Image
          className={styles.bottomnav_alarm_icon}
          src={pathname === "/Alarm" ? "/icons/active_alarm_icon.png" : "/icons/alarm_icon.png"}
          alt='알림'
          width={35}
          height={40}
        />
        <span className={`${styles.bottomnav_alarm_text} ${pathname === "/Alarm" ? styles.active_text : ""}`}>알림</span>
      </Link>

      <Link href='/Calendar' className={styles.bottomnav_calendar}>
        <Image
          className={styles.bottomnav_calendar_icon}
          src={pathname === "/Calendar" ? "/icons/active_calendar_icon.png" : "/icons/calendar_icon.png"}
          alt='달력'
          width={24}
          height={25}
        />
        <span className={`${styles.bottomnav_calendar_text} ${pathname === "/Calendar" ? styles.active_text : ""}`}>달력</span>
      </Link>
    </div>
  );
}
