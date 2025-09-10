/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateInternalNoticeRequest = {
    title?: string;
    content?: string;
    targetYear?: CreateInternalNoticeRequest.targetYear;
    targetDept?: number;
};
export namespace CreateInternalNoticeRequest {
    export enum targetYear {
        ALL_YEARS = 'ALL_YEARS',
        FIRST_YEAR = 'FIRST_YEAR',
        SECOND_YEAR = 'SECOND_YEAR',
        THIRD_YEAR = 'THIRD_YEAR',
        FOURTH_YEAR = 'FOURTH_YEAR',
    }
}

