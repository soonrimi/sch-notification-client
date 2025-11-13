export function formatUploadTime(input: Date | string | null | undefined) {
  if (!input) return '';

  const date = input instanceof Date ? input : new Date(input);
  if (isNaN(date.getTime())) return '';

  const now = new Date();
  let diffMs = now.getTime() - date.getTime();

  // 미래(시계 오차 등) 클램프
  if (diffMs < 0) diffMs = 0;

  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return `${Math.max(1, diffSeconds)}초 전`;
  if (diffMinutes < 60) return `${diffMinutes}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 30) return `${diffDays}일 전`;

  const yNow = now.getFullYear(),
    mNow = now.getMonth(),
    dNow = now.getDate();
  const y = date.getFullYear(),
    m = date.getMonth(),
    d = date.getDate();

  let monthDiff = (yNow - y) * 12 + (mNow - m);
  if (dNow < d) monthDiff -= 1; // 말일 이슈/한달 미만 보정
  if (monthDiff < 1) return `${diffDays}일 전`;
  if (monthDiff < 12) return `${monthDiff}개월 전`;

  let yearDiff = yNow - y;
  if (mNow < m || (mNow === m && dNow < d)) yearDiff -= 1;
  return `${yearDiff}년 전`;
}

export function formatAbsoluteDate(input: Date | string | null | undefined) {
  if (!input) return '';

  const date = input instanceof Date ? input : new Date(input);
  if (isNaN(date.getTime())) return '';

  const now = new Date();
  const isThisYear = date.getFullYear() === now.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  if (isThisYear) {
    // 올해: MM/DD HH:mm
    return `${month}/${day} ${hours}:${minutes}`;
  } else {
    // 올해 아님: YYYY/MM/DD HH:mm
    const year = date.getFullYear();
    return `${year}/${month}/${day} ${hours}:${minutes}`;
  }
}
