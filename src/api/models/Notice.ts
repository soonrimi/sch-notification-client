/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Attachment } from './Attachment';
export type Notice = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  viewCount: number;
  attachments: Array<Attachment>;
  category?: Notice.category;
};
export namespace Notice {
  export enum category {
    UNIVERSITY = 'UNIVERSITY',
    DEPARTMENT = 'DEPARTMENT',
    GRADE = 'GRADE',
    RECRUIT = 'RECRUIT',
    ACTIVITY = 'ACTIVITY',
    PROMOTION = 'PROMOTION',
  }
}
