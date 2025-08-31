/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PageableObject } from './PageableObject';
import type { Response } from './Response';
import type { SortObject } from './SortObject';
export type PageResponse = {
    totalElements?: number;
    totalPages?: number;
    size?: number;
    content?: Array<Response>;
    number?: number;
    sort?: SortObject;
    pageable?: PageableObject;
    numberOfElements?: number;
    last?: boolean;
    first?: boolean;
    empty?: boolean;
};

