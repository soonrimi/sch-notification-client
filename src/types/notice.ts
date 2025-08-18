export interface Notice {
  id: string;
  category: '학교' | '대학' | '학년' | '채용' | '활동' | '홍보';
  upload_time: string;
  application_period: string;
  title: string;
  detail: string;
}
