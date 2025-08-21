/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class HealthCheckService {
  /**
   * 서버 상태 확인
   * 서버가 정상적으로 실행 중인지 확인합니다.
   * @returns any 서버 정상 동작
   * @throws ApiError
   */
  public static health(): CancelablePromise<
    Record<string, Record<string, any>>
  > {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/health',
    });
  }
}
