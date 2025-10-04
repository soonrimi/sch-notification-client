export function formatUploadTime(date: Date | null | undefined) {
  if (!date) return '';

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffMs / 1000 / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  const isThisYear = date.getFullYear() === now.getFullYear();

  if (diffSeconds < 60) {
    // 1분 미만
    return `${diffSeconds}초 전`;
  }

  if (diffMinutes < 60) {
    // 1시간 미만
    return `${diffMinutes}분 전`;
  }

  if (isToday) {
    // 오늘 1시간 이상
    return `${diffHours}시간 전`;
  }

  if (diffDays < 30) {
    // 1일 ~ 30일 전
    return `${diffDays}일 전`;
  }

  if (isThisYear) {
    // 올해: n개월 전
    const monthDiff = now.getMonth() - date.getMonth();
    return `${monthDiff}개월 전`;
  }

  // 올해 아님: X년 전
  const yearDiff = now.getFullYear() - date.getFullYear();
  return `${yearDiff}년 전`;
}
