/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Attachment } from './Attachment';
/**
 * 건의사항 엔티티
 */
export type Board = {
  id?: number;
  title?: string;
  content?: string;
  createdAt?: string;
  attachments?: Array<Attachment>;
};
