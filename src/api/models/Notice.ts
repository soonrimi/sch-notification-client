/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Admin } from './Admin';
import type { Attachment } from './Attachment';
export type Notice = {
  id?: number;
  title?: string;
  content?: string;
  createdAt?: string;
  writer?: Admin;
  viewCount?: number;
  source?: string;
  targetYear?: string;
  targetDept?: string;
  attachments?: Array<Attachment>;
};
