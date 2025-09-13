/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Department } from './Department';
export type KakaoRoomInfoResponse = {
  id?: number;
  department?: Department;
  targetYear?: KakaoRoomInfoResponse.targetYear;
  roomName?: string;
};
export namespace KakaoRoomInfoResponse {
  export enum targetYear {
    ALL_YEARS = 'ALL_YEARS',
    FIRST_YEAR = 'FIRST_YEAR',
    SECOND_YEAR = 'SECOND_YEAR',
    THIRD_YEAR = 'THIRD_YEAR',
    FOURTH_YEAR = 'FOURTH_YEAR',
  }
}
