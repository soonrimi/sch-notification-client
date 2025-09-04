/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateRequest } from '../models/CreateRequest';
import type { PageResponse } from '../models/PageResponse';
import type { Response } from '../models/Response';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BoardApiService {
  /**
   * 모든 건의사항 게시물 페이징 조회
   * 모든 건의사항 게시물 목록을 페이징하여 조회합니다.
   * @param page Zero-based page index (0..N)
   * @param size The size of the page to be returned
   * @param sort Sorting criteria in the format: property,(asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   * @returns PageResponse OK
   * @throws ApiError
   */
  public static getAllBoards(
    page?: number,
    size: number = 10,
    sort?: Array<string>
  ): CancelablePromise<PageResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/api/boards',
      query: {
        page: page,
        size: size,
        sort: sort,
      },
    });
  }
  /**
   * 건의사항 게시물 생성
   * 새로운 건의사항 게시물을 등록합니다.
   * @param requestBody
   * @returns Response OK
   * @throws ApiError
   */
  public static createBoard(requestBody: {
    requestDto?: CreateRequest;
    files?: Array<Blob>;
  }): CancelablePromise<Response> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/api/boards',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * 특정 건의사항 게시물 조회
   * ID를 이용하여 특정 건의사항 게시물을 조회합니다.
   * @param id 조회할 게시물 ID
   * @returns Response OK
   * @throws ApiError
   */
  public static getBoardById(id: number): CancelablePromise<Response> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/api/boards/{id}',
      path: {
        id: id,
      },
    });
  }
  /**
   * 학과명 조회
   * 중복을 제거한 학과명을 조회합니다.
   * @returns string OK
   * @throws ApiError
   */
  public static getDistinctTitles(): CancelablePromise<Array<string>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/api/boards/departments',
    });
  }
}
