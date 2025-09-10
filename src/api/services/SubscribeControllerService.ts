/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateRequest } from '../models/CreateRequest';
import type { Response } from '../models/Response';
import type { UpdateRequest } from '../models/UpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SubscribeControllerService {
    /**
     * @param id
     * @returns Response OK
     * @throws ApiError
     */
    public static getOne(
        id: number,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/subscribe/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns Response OK
     * @throws ApiError
     */
    public static update(
        id: number,
        requestBody: UpdateRequest,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/subscribe/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any OK
     * @throws ApiError
     */
    public static delete(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/subscribe/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns Response OK
     * @throws ApiError
     */
    public static getAll(): CancelablePromise<Array<Response>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/subscribe',
        });
    }
    /**
     * @param requestBody
     * @returns Response OK
     * @throws ApiError
     */
    public static create(
        requestBody: CreateRequest,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/subscribe',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @param category
     * @returns Response OK
     * @throws ApiError
     */
    public static updateCategory(
        id: number,
        category: string,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/subscribe/{id}/category',
            path: {
                'id': id,
            },
            query: {
                'category': category,
            },
        });
    }
}
