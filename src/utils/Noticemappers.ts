import type { CrawlPostsResponse } from '@/api/models/CrawlPostsResponse';
import type { Notice } from '@/types/notice';
import { Category } from '@/constants/categories';

export function mapCrawlPostToNotice(crawl: CrawlPostsResponse): Notice {
  return {
    id: Number(crawl.id),
    category: crawl.category as Category,
    upload_time: crawl.createdAt ? new Date(crawl.createdAt) : new Date(),
    title: crawl.title ?? '',
    detail: crawl.content ?? '',
  };
}
