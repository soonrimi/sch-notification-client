import { Category } from '@/constants/categories';

export interface Notice {
  id: string;
  category: Category;
  upload_time: Date;
  title: string;
  detail: string;
}
