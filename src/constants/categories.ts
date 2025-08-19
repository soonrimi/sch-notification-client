export const categories = [
  '전체',
  '학교',
  '대학',
  '학년',
  '채용',
  '활동',
  '홍보',
] as const;
export type Category = (typeof categories)[number];

export const categoryColors: Record<Category, string> = {
  전체: '#1d9ad6',
  학교: '#e74c3c',
  대학: '#27ae60',
  학년: '#8e44ad',
  채용: '#f39c12',
  활동: '#16a085',
  홍보: '#d35400',
};
