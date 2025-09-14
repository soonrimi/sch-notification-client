export function formatUploadTime(date: Date | null | undefined) {
  if (!date) return '';

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 1000 / 60);

  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  const isThisYear = date.getFullYear() === now.getFullYear();

  if (diffMinutes < 60) return `${diffMinutes}분 전`;

  if (isToday)
    return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });

  if (isThisYear)
    return date.toLocaleString('ko-KR', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}
