/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LoginRequest } from '../models/LoginRequest';
import type { LoginResponse } from '../models/LoginResponse';
import type { ResetPasswordRequest } from '../models/ResetPasswordRequest';
import type { ResetPasswordResponse } from '../models/ResetPasswordResponse';
import type { Response } from '../models/Response';
import type { SignupRequest } from '../models/SignupRequest';
import type { SignupResponse } from '../models/SignupResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminControllerService {
  /**
   * @param requestBody
   * @returns ResetPasswordResponse OK
   * @throws ApiError
   */
  public static resetPassword(
    requestBody: ResetPasswordRequest
  ): CancelablePromise<ResetPasswordResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/admin/reset-password',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * @param requestBody
   * @returns SignupResponse OK
   * @throws ApiError
   */
  public static register(
    requestBody: SignupRequest
  ): CancelablePromise<SignupResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/admin/register',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * @param adminId
   * @param requestBody
   * @returns Response OK
   * @throws ApiError
   */
  public static createNotice(
    adminId: number,
    requestBody?: {
      notice: string;
      file?: Array<Blob>;
    }
  ): CancelablePromise<Response> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/admin/notice',
      query: {
        adminId: adminId,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * @param requestBody
   * @returns LoginResponse OK
   * @throws ApiError
   */
  public static login(
    requestBody: LoginRequest
  ): CancelablePromise<LoginResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/admin/login',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * @param requestBody
   * @returns any OK
   * @throws ApiError
   */
  public static changePassword(
    requestBody: Record<string, string>
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/admin/change-password',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
}
