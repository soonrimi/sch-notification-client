"use client"
import Image from "next/image"
import styles from "./page.module.css"
import { useState, useEffect } from "react"
import HomeHeader from "./components/HomeHeader"
import HomeHeaderCategorys from "./components/HomeHeaderCategorys"
import HomeContent from "./components/HomeContent"
import BottomNav from "./components/BottomNav"

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
  )
}
