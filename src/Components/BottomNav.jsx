"use client"
import React from 'react';
import Image from 'next/image';
import styles from './BottomNav.module.css'
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav () {
  const pathname = usePathname();

  return (
    <div className={styles.bottomnav}>
      <Link href='/' className={styles.bottomnav_home}>
        <Image
          className={styles.bottomnav_home_icon}
          src={pathname === "/" ? "/icons/active_home_icon.png" : "/icons/home_icon.png"}
          alt='홈'
          width={28}
          height={28}
        />
        <span className={`${styles.bottomnav_home_text} ${pathname === "/" ? styles.active_text : ""}`}>홈</span>
      </Link>

      <Link href='/bookmark' className={styles.bottomnav_bookmark}>
        <Image
          className={styles.bottomnav_bookmark_icon}
          src={pathname === "/bookmark/" ? "/icons/active_nav_bookmark_icon.png" : "/icons/nav_bookmark_icon.png"}
          alt='북마크'
          width={16}
          height={21}
        />
        <span className={`${styles.bottomnav_bookmark_text} ${pathname === "/bookmark/" ? styles.active_text : ""}`}>북마크</span>
      </Link>

      <Link href='/alarm' className={styles.bottomnav_alarm}>
        <Image
          className={styles.bottomnav_alarm_icon}
          src={pathname === "/alarm/" ? "/icons/active_alarm_icon.png" : "/icons/alarm_icon.png"}
          alt='알림'
          width={35}
          height={40}
        />
        <span className={`${styles.bottomnav_alarm_text} ${pathname === "/alarm/" ? styles.active_text : ""}`}>알림</span>
      </Link>

      <Link href='/calendar' className={styles.bottomnav_calendar}>
        <Image
          className={styles.bottomnav_calendar_icon}
          src={pathname === "/calendar/" ? "/icons/action_calendar_icon.png" : "/icons/calendar_icon.png"}
          alt='달력'
          width={24}
          height={25}
        />
        <span className={`${styles.bottomnav_calendar_text} ${pathname === "/calendar/" ? styles.active_text : ""}`}>달력</span>
      </Link>
    </div>
  );
}
