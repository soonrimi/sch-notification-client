"use client";
import React from 'react';
import styles from '../page.module.css';
import Image from 'next/image';

export default function HomeNotice ({ category, upload_time, application_period, title, detail}) {
    return (
        <div className={styles.home_notice}>
                <div className={styles.home_notice_content}>
                    <div className={styles.home_notice_info}>
                        <div className={styles.home_notice_info_category}>{category}</div>
                        <div className={styles.home_notice_upload_info}>| {upload_time} | 신청: {application_period}</div>
                    </div>
                    <div className={styles.home_notice_text}>
                        <div className={styles.home_notice_title}>{title}</div>
                        <div className={styles.home_notice_detail}>{detail}</div>
                    </div>
                </div>
                <div className={styles.home_notic_bookmark}>
                    <button className={styles.home_notic_bookmark_btn}>
                        <Image className={styles.home_notic_bookmark_icon} src="/icons/bookmark_icon.png" alt="북마크" width={22.75} height={29} style={{ width: 22.75, height: 29 }} />
                    </button> 
                </div>
                <div className={styles.home_notice_hr}><hr></hr></div>
        </div>
    )
}