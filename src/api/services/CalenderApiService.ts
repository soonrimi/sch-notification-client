/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CalenderDto_Response } from '../models/CalenderDto_Response';
import type { Pageable } from '../models/Pageable';
import type { PageCalenderDto_Response } from '../models/PageCalenderDto_Response';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CalenderApiService {
    /**
     * 캘린더 전체 조회
     * 모든 캘린더 정보를 조회합니다.
     * @param pageable
     * @returns PageCalenderDto_Response 캘린더 조회 성공
     * @throws ApiError
     */
    public static getAllCalenders(
        pageable: Pageable,
    ): CancelablePromise<PageCalenderDto_Response> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/api/calenders',
            query: {
                'pageable': pageable,
            },
        });
    }
    /**
     * 캘린더 상세 조회
     * 캘린더 정보를 조회합니다.
     * @param calenderId 캘린더 ID
     * @returns CalenderDto_Response 캘린더 조회 성공
     * @throws ApiError
     */
    public static getCalender(
        calenderId: number,
    ): CancelablePromise<CalenderDto_Response> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/api/calenders/{calenderId}',
            path: {
                'calenderId': calenderId,
            },
        });
    }
}
