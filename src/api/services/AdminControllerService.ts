/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminDeleteRequest } from '../models/AdminDeleteRequest';
import type { AdminUpdateRequest } from '../models/AdminUpdateRequest';
import type { CreateInternalNoticeRequest } from '../models/CreateInternalNoticeRequest';
import type { Department } from '../models/Department';
import type { InternalNoticeListResponse } from '../models/InternalNoticeListResponse';
import type { LoginRequest } from '../models/LoginRequest';
import type { LoginResponse } from '../models/LoginResponse';
import type { MessageResponse } from '../models/MessageResponse';
import type { MyInfoResponse } from '../models/MyInfoResponse';
import type { ResetPasswordRequest } from '../models/ResetPasswordRequest';
import type { ResetPasswordResponse } from '../models/ResetPasswordResponse';
import type { SignupRequest } from '../models/SignupRequest';
import type { SignupResponse } from '../models/SignupResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminControllerService {
    /**
     * @param adminId
     * @param requestBody
     * @returns MyInfoResponse OK
     * @throws ApiError
     */
    public static updateAdmin(
        adminId: number,
        requestBody: AdminUpdateRequest,
    ): CancelablePromise<MyInfoResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/admin/{adminId}',
            path: {
                'adminId': adminId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param adminId
     * @param requestBody
     * @returns MessageResponse OK
     * @throws ApiError
     */
    public static deleteAdmin(
        adminId: number,
        requestBody: AdminDeleteRequest,
    ): CancelablePromise<MessageResponse> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/admin/{adminId}',
            path: {
                'adminId': adminId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns ResetPasswordResponse OK
     * @throws ApiError
     */
    public static resetPassword(
        requestBody: ResetPasswordRequest,
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
        requestBody: SignupRequest,
    ): CancelablePromise<SignupResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin/register',
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
        requestBody: LoginRequest,
    ): CancelablePromise<LoginResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin/login',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param authorization
     * @param formData
     * @returns InternalNoticeListResponse OK
     * @throws ApiError
     */
    public static createInternalNotice(
        authorization: string,
        formData?: {
            internalNotice: CreateInternalNoticeRequest;
            file?: Array<Blob>;
        },
    ): CancelablePromise<InternalNoticeListResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin/internal-notice',
            headers: {
                'Authorization': authorization,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }
    /**
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static changePassword(
        requestBody: Record<string, string>,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin/change-password',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param authorization
     * @returns InternalNoticeListResponse OK
     * @throws ApiError
     */
    public static getMyNotices(
        authorization: string,
    ): CancelablePromise<Array<InternalNoticeListResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/my-notices',
            headers: {
                'Authorization': authorization,
            },
        });
    }
    /**
     * @returns MyInfoResponse OK
     * @throws ApiError
     */
    public static getAllAdmins(): CancelablePromise<Array<MyInfoResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/list',
        });
    }
    /**
     * @returns Department OK
     * @throws ApiError
     */
    public static getAllDepartment(): CancelablePromise<Array<Department>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/departments',
        });
    }
}
