// 'use client';
// import React, { useState, useEffect } from 'react';
// import styles from './Home.module.css';
// import HomeHeaderCategorys from './HomeHeaderCategorys';
// import { useNotices } from '@/hooks/useNotices';
// import Layout from '@/Components/LayoutDir/Layout';
// import { useCategories, CategoryItem } from '@/contexts/CategoryContext';
// import SharedNoticeItem from '@/Components/Head/SharedNoticeItem';
// import { ALL_CATEGORY } from '@/constants/categories';

// export default function HomeContent() {
//   const { items } = useCategories();
//   const allCategory: CategoryItem = ALL_CATEGORY;
//   const [category, setCategory] = useState<CategoryItem>(allCategory);

//   const [categoriesForUI, setCategoriesForUI] = useState<CategoryItem[]>([
//     allCategory,
//   ]);
//   useEffect(() => {
//     if (items.length > 0) {
//       const filteredItems = items.filter((category) => category.id !== 'ALL');
//       setCategoriesForUI([allCategory, ...filteredItems]);
//     }
//   }, [items]);

//   // notices 가져오기
//   const { notices } = useNotices(category.id);

//   const [readIds, setReadIds] = useState<number[]>([]);
//   const [loading, setLoading] = useState(true);

//   // 최근 공지 순 정렬
//   const sortedNotices = [...notices].sort(
//     (a, b) => (b.upload_time?.getTime() ?? 0) - (a.upload_time?.getTime() ?? 0)
//   );

//   // 로컬스토리지에서 읽은 공지 불러오기
//   useEffect(() => {
//     setLoading(true);

//     try {
//       const savedReads = localStorage.getItem('readNotices');
//       if (savedReads) {
//         setReadIds(JSON.parse(savedReads).map(Number));
//       }
//     } catch (err) {
//       console.warn('로컬스토리지 읽기 실패', err);
//       setReadIds([]);
//     }

//     setLoading(false);
//   }, [category]);

//   return (
//     <Layout headerProps={{ pageType: 'home' }}>
//       <div className={styles.home_content_wrapper}>
//         <HomeHeaderCategorys
//           category={category}
//           setCategory={setCategory}
//           categories={categoriesForUI}
//         />
//         <div className={styles.home_content}>
//           {loading ? (
//             <div className={styles.loading}>로딩중...</div>
//           ) : notices.length === 0 ? (
//             <div className={styles.no_notice}>공지 없음</div>
//           ) : (
//             sortedNotices.map((notice) => (
//               <SharedNoticeItem
//                 key={notice.id}
//                 notice={notice}
//                 isRead={readIds.includes(notice.id)}
//               />
//             ))
//           )}
//         </div>
//       </div>
//     </Layout>
//   );
// }
'use client';
import React, { useState, useEffect } from 'react';
import styles from './Home.module.css';
import HomeHeaderCategorys from './HomeHeaderCategorys';
import { useNotices } from '@/hooks/useNotices';
import type { Notice } from '@/types/notice';
import Layout from '@/Components/LayoutDir/Layout';
import { useCategories, CategoryItem } from '@/contexts/CategoryContext';
import SharedNoticeItem from '@/Components/Head/SharedNoticeItem';
import { ALL_CATEGORY } from '@/constants/categories';

export default function HomeContent() {
  const { items } = useCategories();
  const allCategory: CategoryItem = ALL_CATEGORY;
  const [category, setCategory] = useState<CategoryItem>(allCategory);

  // UI용 카테고리 배열
  const [categoriesForUI, setCategoriesForUI] = useState<CategoryItem[]>([
    allCategory,
  ]);
  useEffect(() => {
    if (items.length > 0) {
      const filteredItems = items.filter((c) => c.id !== 'ALL');
      setCategoriesForUI([allCategory, ...filteredItems]);
    }
  }, [items]);

  // notices 가져오기 (loading 포함)
  const { notices, loading } = useNotices(category.id);

  // 로컬스토리지에서 읽은 공지 ID
  const [readIds, setReadIds] = useState<number[]>([]);
  useEffect(() => {
    try {
      const savedReads = localStorage.getItem('readNotices');
      if (savedReads) {
        setReadIds(JSON.parse(savedReads).map(Number));
      }
    } catch (err) {
      console.warn('로컬스토리지 읽기 실패', err);
      setReadIds([]);
    }
  }, [category]);

  // 최근 공지 순 정렬
  const sortedNotices = [...notices].sort(
    (a, b) => (b.upload_time?.getTime() ?? 0) - (a.upload_time?.getTime() ?? 0)
  );

  return (
    <Layout headerProps={{ pageType: 'home' }}>
      <div className={styles.home_content_wrapper}>
        <HomeHeaderCategorys
          category={category}
          setCategory={setCategory}
          categories={categoriesForUI}
        />
        <div className={styles.home_content}>
          {loading ? (
            <div className={styles.loading}>로딩중...</div>
          ) : sortedNotices.length === 0 ? (
            <div className={styles.no_notice}>공지 없음</div>
          ) : (
            sortedNotices.map((notice: Notice) => (
              <SharedNoticeItem
                key={notice.id}
                notice={notice}
                isRead={readIds.includes(notice.id)}
              />
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
