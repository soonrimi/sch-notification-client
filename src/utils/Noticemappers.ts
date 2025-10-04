import type { ListResponse } from '@/api/models/ListResponse';
import type { Notice } from '@/types/notice';

export function mapCrawlPostToNotice(response: ListResponse): Notice {
  return {
    id: Number(response.id),
    category: String(response.categoryName),
    upload_time: response.createdAt ? new Date(response.createdAt) : new Date(),
    writer: response.writer ?? '',
    title: response.title ?? '',
    detail: response.content ?? '',
  };
}
