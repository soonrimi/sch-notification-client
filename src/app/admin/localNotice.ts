'use client';

export type Category =
  | '전체'
  | '학교'
  | '대학'
  | '학년'
  | '채용'
  | '활동'
  | '홍보';

export type LocalAttachment = { name: string };

export type LocalNotice = {
  id: string;
  title: string;
  content: string;
  category: Category;
  createdAt: string; // ISO
  attachments: LocalAttachment[];
};

const STORAGE_KEY = 'soonrimi_admin_notices';

export function loadNotices(): LocalNotice[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as LocalNotice[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveNotices(list: LocalNotice[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function addNotice(n: LocalNotice) {
  const list = loadNotices();
  list.push(n);
  saveNotices(list);
}

export function deleteNotice(id: string) {
  const list = loadNotices().filter((x) => x.id !== id);
  saveNotices(list);
}

/** 비어있을 때만 샘플 데이터 추가 */
export function seedIfEmpty() {
  const now = Date.now();
  const list = loadNotices();
  if (list.length > 0) return;

  saveNotices([
    {
      id: 'seed-1',
      title: '2025학년도 2학기 생활관 모집 안내',
      content:
        '신청기간: 07.20~30 / 대상: 전체 / 제출서류 확인 바랍니다.',
      category: '대학',
      createdAt: new Date(now - 2 * 60 * 1000).toISOString(), // 2분 전 → 삭제 가능
      attachments: [{ name: '모집요강.pdf' }],
    },
    {
      id: 'seed-2',
      title: '현장실습 기업 추가 모집',
      content: '3학년 대상 / 세부사항은 학과공지 참고.',
      category: '학년',
      createdAt: new Date(now - 8 * 60 * 1000).toISOString(), // 8분 전 → 삭제 불가
      attachments: [],
    },
  ]);
}
