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
