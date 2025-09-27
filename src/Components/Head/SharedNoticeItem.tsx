'use client';
import { useRouter } from 'next/navigation';
import HomeNotice from '@/app/home/HomeNotice';
import { useBookmark } from '@/hooks/useBookmark';
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
  const { bookmarked, toggleBookmark } = useBookmark(notice.id);
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
      <HomeNotice
        id={notice.id}
        category={notice.category}
        upload_time={notice.upload_time}
        title={notice.title}
        detail={notice.detail}
        isBookmarked={bookmarked}
        onToggleBookmark={toggleBookmark}
        isRead={isRead}
        BookmarkDeleteMode={BookmarkDeleteMode}
        isSelectedForBookmarkDelete={isSelectedForBookmarkDelete}
      />
    </div>
  );
}
