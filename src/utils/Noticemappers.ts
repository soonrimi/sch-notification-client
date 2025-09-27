import type { ListResponse } from '@/api/models/ListResponse';
import type { Notice } from '@/types/notice';
import { Category } from '@/constants/categories';

export function mapCrawlPostToNotice(response: ListResponse): Notice {
  return {
    id: Number(response.id),
    category: String(response.categoryName),
    upload_time: response.createdAt ? new Date(response.createdAt) : new Date(),
    title: response.title ?? '',
    detail: response.content ?? '',
  };
}
