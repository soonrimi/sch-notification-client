// 'use client';

// import React from 'react';
// import Link from 'next/link';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
// import styles from './Home.module.css';
// import { Notice } from '@/types/notice';
// import { CATEGORY_COLORS } from '@/constants/categories';
// import { formatUploadTime } from '@/utils/NoticeDate';

// interface NoticeItemProps extends Notice {
//   isRead: boolean;
//   BookmarkDeleteMode?: boolean;
//   isSelectedForBookmarkDelete?: boolean;
// }

// export default function NoticeItem({
//   id,
//   category,
//   title,
//   isRead,
//   detail,
//   writer,
//   BookmarkDeleteMode = false,
//   isSelectedForBookmarkDelete = false,
//   upload_time,
// }: NoticeItemProps) {
//   const noticeContent = (
//     <div className={styles.home_notice_content}>
//       <div className={styles.home_notice_body}>
//         <div
//           className={`${styles.home_notice_title} ${isRead ? styles.read : ''}`}
//         >
//           {title}
//         </div>

//         <div
//           className={`${styles.home_notice_detail} ${isRead ? styles.read : ''}`}
//           dangerouslySetInnerHTML={{ __html: detail ?? '' }}
//         />
//         <div className={styles.home_notice_info}>
//           <div
//             style={{
//               width: 30,
//               height: 17,
//               borderRadius: '999px',
//               fontSize: 10,
//               color: '#fff',
//               display: 'flex',
//               justifyContent: 'center',
//               alignItems: 'center',
//               marginRight: 5,
//               backgroundColor: CATEGORY_COLORS[category] || '#000',
//             }}
//           >
//             {category}
//           </div>
//           <div className={styles.home_notice_upload_info}>
//             | {formatUploadTime(upload_time)} | {writer}
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div
//       className={styles.home_notice}
//       style={{
//         backgroundColor:
//           BookmarkDeleteMode && isSelectedForBookmarkDelete
//             ? '#bda10030'
//             : 'transparent',
//       }}
//     >
//       <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
//         {BookmarkDeleteMode && (
//           <div
//             style={{
//               width: 0,
//               marginRight: 0,
//               display: 'flex',
//               justifyContent: 'center',
//             }}
//           >
//             {isSelectedForBookmarkDelete ? (
//               <CheckCircleIcon
//                 className={styles.selection_circle}
//                 sx={{ color: '#bda100ff', fontSize: 22 }}
//               />
//             ) : (
//               <RadioButtonUncheckedIcon
//                 className={styles.selection_circle}
//                 sx={{ color: '#A1A1A1', fontSize: 22 }}
//               />
//             )}
//           </div>
//         )}

//         {BookmarkDeleteMode ? (
//           noticeContent
//         ) : (
//           <Link
//             href={`/home?id=${id}`}
//             prefetch={false}
//             style={{ display: 'block', width: '100%' }}
//           >
//             {noticeContent}
//           </Link>
//         )}
//       </div>

//       <hr className={styles.home_notice_hr} />
//     </div>
//   );
// }
'use client';

import React from 'react';
import Link from 'next/link';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import styles from './Home.module.css';
import { Notice } from '@/types/notice';
import { CATEGORY_COLORS } from '@/constants/categories';
import { formatUploadTime } from '@/utils/NoticeDate';

interface NoticeItemProps extends Notice {
  isRead: boolean;
  BookmarkDeleteMode?: boolean;
  isSelectedForBookmarkDelete?: boolean;
}

export default function NoticeItem({
  id,
  category,
  title,
  isRead,
  detail,
  writer,
  BookmarkDeleteMode = false,
  isSelectedForBookmarkDelete = false,
  upload_time,
}: NoticeItemProps) {
  const noticeContent = (
    <div className={styles.home_notice_content}>
      <div className={styles.home_notice_body}>
        <div
          className={`${styles.home_notice_title} ${isRead ? styles.read : ''}`}
        >
          {title}
        </div>

        <div
          className={`${styles.home_notice_detail} ${isRead ? styles.read : ''}`}
          dangerouslySetInnerHTML={{ __html: detail ?? '' }}
        />
        <div className={styles.home_notice_info}>
          <div
            style={{
              width: 30,
              height: 17,
              borderRadius: '999px',
              fontSize: 10,
              color: '#fff',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 5,
              backgroundColor: CATEGORY_COLORS[category] || '#000',
            }}
          >
            {category}
          </div>
          <div className={styles.home_notice_upload_info}>
            | {formatUploadTime(upload_time)} | {writer}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={styles.home_notice}
      style={{
        backgroundColor:
          BookmarkDeleteMode && isSelectedForBookmarkDelete
            ? '#bda10030'
            : 'transparent',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        {BookmarkDeleteMode && (
          <div
            style={{
              width: 0,
              marginRight: 0,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            {isSelectedForBookmarkDelete ? (
              <CheckCircleIcon
                className={styles.selection_circle}
                sx={{ color: '#bda100ff', fontSize: 22 }}
              />
            ) : (
              <RadioButtonUncheckedIcon
                className={styles.selection_circle}
                sx={{ color: '#A1A1A1', fontSize: 22 }}
              />
            )}
          </div>
        )}

        {BookmarkDeleteMode ? (
          noticeContent
        ) : (
          <Link
            href={`/home?id=${id}`}
            prefetch={false}
            style={{ display: 'block', width: '100%' }}
          >
            {noticeContent}
          </Link>
        )}
      </div>

      <hr className={styles.home_notice_hr} />
    </div>
  );
}
