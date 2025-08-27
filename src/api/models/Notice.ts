/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Admin } from './Admin';
import type { Attachment } from './Attachment';
export type Notice = {
    id?: number;
    title?: string;
    content?: string;
    createdAt?: string;
    attachments?: Array<Attachment>;
    author?: string;
    viewCount?: number;
    writer?: Admin;
    targetYear?: string;
    targetDept?: string;
};

