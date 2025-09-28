// 'use client';
// import { useRouter } from 'next/navigation';
// import NoticeItem from '@/app/home/NoticeItem';
// import { Notice } from '@/types/notice';

// type Props = {
//   notice: Notice;
//   isRead: boolean;
//   BookmarkDeleteMode?: boolean;
//   isSelectedForBookmarkDelete?: boolean;
//   onSelectToggle?: (id: number) => void;
//   hrefBuilder?: (id: number) => string;
// };

// export default function SharedNoticeItem({
//   notice,
//   isRead,
//   BookmarkDeleteMode = false,
//   isSelectedForBookmarkDelete = false,
//   onSelectToggle,
//   hrefBuilder = (id) => `/home?id=${encodeURIComponent(id)}`,
// }: Props) {
//   const router = useRouter();

//   const handleClick = () => {
//     if (BookmarkDeleteMode) {
//       onSelectToggle?.(notice.id);
//     } else {
//       router.push(hrefBuilder(notice.id));
//     }
//   };

//   return (
//     <div style={{ cursor: 'pointer', marginBottom: 0 }} onClick={handleClick}>
//       <NoticeItem
//         id={notice.id}
//         category={notice.category}
//         upload_time={notice.upload_time}
//         writer={notice.writer}
//         title={notice.title}
//         detail={notice.detail}
//         isRead={isRead}
//         BookmarkDeleteMode={BookmarkDeleteMode}
//         isSelectedForBookmarkDelete={isSelectedForBookmarkDelete}
//       />
//     </div>
//   );
// }
'use client';
import { useRouter } from 'next/navigation';
import NoticeItem from '@/app/home/NoticeItem';
import { Notice } from '@/types/notice';

type Props = {
  notice: Notice;
  isRead: boolean;
  BookmarkDeleteMode?: boolean;
  isSelectedForBookmarkDelete?: boolean;
  onSelectToggle?: (id: number) => void;
  hrefBuilder?: (id: number) => string;
};

export default function SharedNoticeItem({
  notice,
  isRead,
  BookmarkDeleteMode = false,
  isSelectedForBookmarkDelete = false,
  onSelectToggle,
  hrefBuilder = (id) => `/home?id=${encodeURIComponent(id)}`,
}: Props) {
  const router = useRouter();

  const handleClick = () => {
    if (BookmarkDeleteMode) {
      onSelectToggle?.(notice.id);
    } else {
      router.push(hrefBuilder(notice.id));
    }
  };

  return (
    <div style={{ cursor: 'pointer', marginBottom: 0 }} onClick={handleClick}>
      <NoticeItem
        id={notice.id}
        category={notice.category}
        upload_time={notice.upload_time}
        writer={notice.writer}
        title={notice.title}
        detail={notice.detail}
        isRead={isRead}
        BookmarkDeleteMode={BookmarkDeleteMode}
        isSelectedForBookmarkDelete={isSelectedForBookmarkDelete}
      />
    </div>
  );
}
