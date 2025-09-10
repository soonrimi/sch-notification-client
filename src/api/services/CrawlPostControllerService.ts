/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CrawlPostsResponse } from '../models/CrawlPostsResponse';
import type { Notice } from '../models/Notice';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CrawlPostControllerService {
    /**
     * @returns CrawlPostsResponse OK
     * @throws ApiError
     */
    public static getAllNotices(): CancelablePromise<Array<CrawlPostsResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/notice',
        });
    }
    /**
     * @param id
     * @returns CrawlPostsResponse OK
     * @throws ApiError
     */
    public static getNotice(
        id: number,
    ): CancelablePromise<CrawlPostsResponse> {
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
     * @returns CrawlPostsResponse OK
     * @throws ApiError
     */
    public static getNoticesByCategoryId(
        categoryId: number,
    ): CancelablePromise<Array<CrawlPostsResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/notice/category/{categoryId}',
            path: {
                'categoryId': categoryId,
            },
        });
    }
}
