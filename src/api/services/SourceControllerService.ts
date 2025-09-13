/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CategoryResponse } from '../models/CategoryResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SourceControllerService {
  /**
   * @returns CategoryResponse OK
   * @throws ApiError
   */
  public static getAllTags(): CancelablePromise<Array<CategoryResponse>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/tag',
    });
  }
}
