/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateInternalNoticeRequest = {
  title: string;
  content: string;
  category: CreateInternalNoticeRequest.category;
  targetYear: CreateInternalNoticeRequest.targetYear;
  targetDepartmentIds: Array<number>;
};
export namespace CreateInternalNoticeRequest {
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
