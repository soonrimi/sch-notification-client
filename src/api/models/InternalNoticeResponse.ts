/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AttachmentResponse } from './AttachmentResponse';
import type { Department } from './Department';
export type InternalNoticeResponse = {
  id?: number;
  title?: string;
  content?: string;
  createdAt?: string;
  viewCount?: number;
  writerName?: string;
  targetYear?: InternalNoticeResponse.targetYear;
  targetDept?: Department;
  attachments?: Array<AttachmentResponse>;
};
export namespace InternalNoticeResponse {
  export enum targetYear {
    ALL_YEARS = 'ALL_YEARS',
    FIRST_YEAR = 'FIRST_YEAR',
    SECOND_YEAR = 'SECOND_YEAR',
    THIRD_YEAR = 'THIRD_YEAR',
    FOURTH_YEAR = 'FOURTH_YEAR',
  }
}
