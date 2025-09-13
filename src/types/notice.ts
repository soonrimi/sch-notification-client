export interface Category {
  id: number;
  name: string;
}

export interface Notice {
  id: string;
  category: Category;
  upload_time: Date;
  title: string;
  detail: string;
}
