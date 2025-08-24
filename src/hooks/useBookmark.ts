import { useState, useEffect } from 'react';

export function useBookmark(noticeId: string) {
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('bookmarkedIds') || '[]');
    setBookmarked(saved.includes(noticeId));
  }, [noticeId]);

  const toggleBookmark = () => {
    const saved = JSON.parse(localStorage.getItem('bookmarkedIds') || '[]');
    const newBookmarked = saved.includes(noticeId)
      ? saved.filter((x: string) => x !== noticeId)
      : [...saved, noticeId];
    localStorage.setItem('bookmarkedIds', JSON.stringify(newBookmarked));
    setBookmarked(!bookmarked);
  };

  return { bookmarked, toggleBookmark };
}
