/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PageableObject } from './PageableObject';
import type { Response } from './Response';
import type { SortObject } from './SortObject';
export type PageResponse = {
    totalPages?: number;
    totalElements?: number;
    number?: number;
    size?: number;
    numberOfElements?: number;
    content?: Array<Response>;
    sort?: SortObject;
    first?: boolean;
    last?: boolean;
    pageable?: PageableObject;
    empty?: boolean;
};

