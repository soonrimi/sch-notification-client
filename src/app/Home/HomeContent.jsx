"use client";
import React, {useEffect, useState} from 'react';
import styles from "../page.module.css";
import HomeNotice from './HomeNotice';

export default function HomeContent() {
    // const [notices, setNotices] = useState([]);

    // useEffect(() => {
    //     fetch('${}/notices')
    //         .then(res => res.json())
    //         .then(data => {
    //             setNotices(data);
    //         })
    //         .catch(err => {
    //             console.error('공지 불러오기 실패:', err);
    //         });
    // }, []);
    const notices = Array.from({length: 10}, () => ({
        category: "대학",
        upload_time: "15:57",
        application_period: "07/30~8/5",
        title: "2025학년도 2학기 생활관 모집 안내",
        detail: "2025학년도 2학기 생활관생 모집을 붙임과 같이 안내하오니 입사를 희망하는 학생은 기간내에 신청하기 바라며, 입사일 이전 개인 위생을 철저히..."
    }));
    
    return (
        <div className={styles.home_content}>
           {notices.map((notice, index) => (
            <HomeNotice 
                key={index}
                category={notice.category}
                upload_time={notice.upload_time}
                application_period={notice.application_period}
                title={notice.title}
                detail={notice.detail}
            />
           ))} 
        </div>
    );
} 