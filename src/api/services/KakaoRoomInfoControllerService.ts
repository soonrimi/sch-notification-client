/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateKakaoRoomInfoRequest } from '../models/CreateKakaoRoomInfoRequest';
import type { KakaoRoomInfoResponse } from '../models/KakaoRoomInfoResponse';
import type { UpdateKakaoRoomInfoRequest } from '../models/UpdateKakaoRoomInfoRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class KakaoRoomInfoControllerService {
  /**
   * @param id
   * @param requestBody
   * @returns KakaoRoomInfoResponse OK
   * @throws ApiError
   */
  public static updateRoom(
    id: number,
    requestBody: UpdateKakaoRoomInfoRequest
  ): CancelablePromise<KakaoRoomInfoResponse> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/kakao/{id}',
      path: {
        id: id,
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
  public static deleteRoom(id: number): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/kakao/{id}',
      path: {
        id: id,
      },
    });
  }
  /**
   * @param requestBody
   * @returns KakaoRoomInfoResponse OK
   * @throws ApiError
   */
  public static createRoom(
    requestBody: CreateKakaoRoomInfoRequest
  ): CancelablePromise<KakaoRoomInfoResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/kakao',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
}
