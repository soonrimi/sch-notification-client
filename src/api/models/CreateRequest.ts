/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * 내부 공지 생성 요청
 */
export type CreateRequest = {
    title?: string;
    content?: string;
    targetYear?: CreateRequest.targetYear;
    targetDept?: number;
};
export namespace CreateRequest {
    export enum targetYear {
        ALL_YEARS = 'ALL_YEARS',
        FIRST_YEAR = 'FIRST_YEAR',
        SECOND_YEAR = 'SECOND_YEAR',
        THIRD_YEAR = 'THIRD_YEAR',
        FOURTH_YEAR = 'FOURTH_YEAR',
    }
}

