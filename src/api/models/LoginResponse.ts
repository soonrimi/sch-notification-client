/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type LoginResponse = {
    userId?: string;
    name?: string;
    role?: LoginResponse.role;
    message?: string;
    token?: string;
};
export namespace LoginResponse {
    export enum role {
        SUPER_ADMIN = 'SUPER_ADMIN',
        ADMIN = 'ADMIN',
    }
}

