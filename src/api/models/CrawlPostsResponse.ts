/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AttachmentResponse } from './AttachmentResponse';
export type CrawlPostsResponse = {
  id?: number;
  title?: string;
  content?: string;
  createdAt?: string;
  category?: CrawlPostsResponse.category;
  viewCount?: number;
  attachments?: Array<AttachmentResponse>;
};
export namespace CrawlPostsResponse {
  export enum category {
    UNIVERSITY = 'UNIVERSITY',
    DEPARTMENT = 'DEPARTMENT',
    GRADE = 'GRADE',
    RECRUIT = 'RECRUIT',
    ACTIVITY = 'ACTIVITY',
    PROMOTION = 'PROMOTION',
  }
}
