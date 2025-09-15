import { Category } from '@/constants/categories';

export interface Notice {
  id: number;
  category: Category;
  upload_time: Date;
  title: string;
  detail: string;
}
