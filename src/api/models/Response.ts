/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AttachmentResponse } from './AttachmentResponse';
export type Response = {
  id?: number;
  title?: string;
  author?: string;
  content?: string;
  targetYear?: string;
  targetDept?: string;
  source?: string;
  createdAt?: string;
  viewCount?: number;
  attachments?: Array<AttachmentResponse>;
};
