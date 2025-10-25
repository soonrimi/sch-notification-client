// import { useState, useEffect } from 'react';

// interface UseReadNoticesOptions {
//   category?: string;
//   noticeId?: number;
// }

// export function useReadNotices({ category, noticeId }: UseReadNoticesOptions = {}) {
//   const [readIds, setReadIds] = useState<number[]>([]);

//   useEffect(() => {
//     try {
//       const savedReads = localStorage.getItem('readNotices');
//       if (savedReads) setReadIds(JSON.parse(savedReads).map(Number));
//     } catch (err) {
//       console.warn('로컬스토리지 읽기 실패', err);
//       setReadIds([]);
//     }
//   }, [category]);

//   const markAsRead = (id: number) => {
//     try {
//       const savedReads = localStorage.getItem('readNotices') || '[]';
//       const readNotices: number[] = JSON.parse(savedReads);
//       if (!readNotices.includes(id)) {
//         readNotices.push(id);
//         localStorage.setItem('readNotices', JSON.stringify(readNotices));
//         setReadIds(readNotices);
//       }
//     } catch (err) {
//       console.warn('로컬스토리지 쓰기 실패', err);
//     }
//   };

//   useEffect(() => {
//     if (notice?.id != null) markAsRead(notice?.id);
//   }, [notice]);

//   return { readIds, markAsRead };
// }
