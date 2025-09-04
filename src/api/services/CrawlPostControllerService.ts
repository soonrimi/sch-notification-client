/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Notice } from '../models/Notice';
import type { Response } from '../models/Response';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CrawlPostControllerService {
    /**
     * @returns Response OK
     * @throws ApiError
     */
    public static getAllNotices(): CancelablePromise<Array<Response>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/notice',
        });
    }
    /**
     * @param id
     * @returns Response OK
     * @throws ApiError
     */
    public static getNotice(
        id: number,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/notice/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param keyword
     * @returns Notice OK
     * @throws ApiError
     */
    public static searchNotices(
        keyword: string,
    ): CancelablePromise<Array<Notice>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/notice/search',
            query: {
                'keyword': keyword,
            },
        });
    }
    /**
     * @param categoryId
     * @returns Response OK
     * @throws ApiError
     */
    public static getNoticesByCategoryId(
        categoryId: number,
    ): CancelablePromise<Array<Response>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/notice/category/{categoryId}',
            path: {
                'categoryId': categoryId,
            },
        });
    }
}
