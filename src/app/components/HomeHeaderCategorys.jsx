"use client";
import React from 'react';
import styles from "../page.module.css";
import Image from "next/image";

export default function HomeHeaderCategorys() {
    return (
        <div className={styles.home_categorys}>
                <button className={styles.home_category_clicked}>전체</button>
                <button className={styles.home_category_unclicked}>학교</button>
                <button className={styles.home_category_unclicked}>대학</button>
                <button className={styles.home_category_unclicked}>학년</button>
                <button className={styles.home_category_unclicked}>채용</button>
                <button className={styles.home_category_unclicked}>활동</button>
                <button className={styles.home_category_unclicked}>홍보</button>
                <button className={styles.home_category_edit}> <Image src="/icons/category_edit_icon.png" alt='편집' width={23} height={23}/> </button>
        </div>
    )
}