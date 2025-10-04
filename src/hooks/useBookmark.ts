import { useState, useEffect } from 'react';

export function useBookmark(noticeId: number) {
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('bookmarkedIds') || '[]');
    setBookmarked(saved.includes(noticeId));
  }, [noticeId]);

  const toggleBookmark = () => {
    const saved = JSON.parse(localStorage.getItem('bookmarkedIds') || '[]');
    const newBookmarked = saved.includes(noticeId)
      ? saved.filter((x: number) => x !== noticeId)
      : [...saved, noticeId];
    localStorage.setItem('bookmarkedIds', JSON.stringify(newBookmarked));
    setBookmarked((prev) => !prev);
  };

  return { bookmarked, toggleBookmark };
}
