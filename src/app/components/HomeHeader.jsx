"use client";
import React from "react";
import styles from "../page.module.css";
import Image from "next/image";
import Link from 'next/link';

export default function HomeHeader() {
  return (
    <div className={styles.home_header}>
      <div className={styles.home_header_icons}>
        <Image
          className={styles.home_header_icon_search}
          src="/icons/search_icon.png"
          alt="검색"
          width={18.16}
          height={20.99}
        />
        <Link href="/settings" className={styles.bottomnav_home}>
          <Image
            className={styles.home_header_icon_setting}
            src="/icons/setting_icon.png"
            alt="설정"
            width={20}
            height={20}
          />
        </Link>
      </div>
    </div>
  );
}
