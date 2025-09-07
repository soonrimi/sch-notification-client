// 게시판 필터용(목록 화면 등) — '전체' 포함
export type Category =
  | '전체'
  | '학교'
  | '대학'
  | '학과'
  | '학년'
  | '채용'
  | '활동'
  | '홍보';

// 실제 글에 저장되는 게시판 — '전체'는 글의 카테고리가 될 수 없으므로 제외
export type BoardCategory = Exclude<Category, '전체'>;

export type LocalNoticeFile = {
  id: string;
  name: string;
};

export type LocalNotice = {
  id: string;
  title: string;
  content: string;
  category: BoardCategory;
  // 학년 게시판일 때만 표시용으로 저장
  year?: string;
  files: LocalNoticeFile[];
  createdAt: string; // ISO
};

export const LS_KEY = 'SOONRIMI_LOCAL_NOTICES';
export const DELETE_WINDOW_MS = 5 * 60 * 1000; // 5분

// 로컬 목록 불러오기
export function loadLocalNotices(): LocalNotice[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw) as LocalNotice[];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

// 로컬 목록 저장하기
export function saveLocalNotices(list: LocalNotice[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

// 단건 삭제(5분 내 삭제 버튼에서 사용)
export function deleteLocalNotice(id: string) {
  const list = loadLocalNotices().filter((n) => n.id !== id);
  saveLocalNotices(list);
}

// 등록 후 삭제 가능 시간(초) 계산
export function remainSeconds(createdAt: string): number {
  const deadline = new Date(createdAt).getTime() + DELETE_WINDOW_MS;
  const diffMs = deadline - Date.now();
  return Math.max(0, Math.ceil(diffMs / 1000));
}

// mm:ss 포맷
export function formatMMSS(sec: number): string {
  const mm = String(Math.floor(sec / 60)).padStart(2, '0');
  const ss = String(sec % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}
