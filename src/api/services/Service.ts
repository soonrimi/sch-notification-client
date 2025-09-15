/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { KakaoRoomInfoResponse } from '../models/KakaoRoomInfoResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class Service {
  /**
   * @param id
   * @returns KakaoRoomInfoResponse OK
   * @throws ApiError
   */
  public static getRoomById(
    id: number
  ): CancelablePromise<KakaoRoomInfoResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/kakao/{id}',
      path: {
        id: id,
      },
    });
  }
  /**
   * @param lessonId
   * @param targetyear
   * @returns KakaoRoomInfoResponse OK
   * @throws ApiError
   */
  public static getRoomsByFilter(
    lessonId?: number,
    targetyear?:
      | 'ALL_YEARS'
      | 'FIRST_YEAR'
      | 'SECOND_YEAR'
      | 'THIRD_YEAR'
      | 'FOURTH_YEAR'
  ): CancelablePromise<Array<KakaoRoomInfoResponse>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/kakao',
      query: {
        lessonId: lessonId,
        targetyear: targetyear,
      },
    });
  }
}
