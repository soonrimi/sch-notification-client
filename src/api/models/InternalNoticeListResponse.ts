/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Department } from './Department';
import type { InternalNoticeAttachmentResponse } from './InternalNoticeAttachmentResponse';
export type InternalNoticeListResponse = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  viewCount: number;
  writerName: string;
  category: InternalNoticeListResponse.category;
  targetYear: InternalNoticeListResponse.targetYear;
  targetDept: Array<Department>;
  attachments: Array<InternalNoticeAttachmentResponse>;
};
export namespace InternalNoticeListResponse {
  export enum category {
    UNIVERSITY = 'UNIVERSITY',
    DEPARTMENT = 'DEPARTMENT',
    GRADE = 'GRADE',
    RECRUIT = 'RECRUIT',
    ACTIVITY = 'ACTIVITY',
    PROMOTION = 'PROMOTION',
  }
  export enum targetYear {
    ALL_YEARS = 'ALL_YEARS',
    FIRST_YEAR = 'FIRST_YEAR',
    SECOND_YEAR = 'SECOND_YEAR',
    THIRD_YEAR = 'THIRD_YEAR',
    FOURTH_YEAR = 'FOURTH_YEAR',
  }
}
