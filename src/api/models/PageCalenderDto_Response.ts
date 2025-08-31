/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CalenderDto_Response } from './CalenderDto_Response';
import type { PageableObject } from './PageableObject';
import type { SortObject } from './SortObject';
export type PageCalenderDto_Response = {
    totalElements?: number;
    totalPages?: number;
    size?: number;
    content?: Array<CalenderDto_Response>;
    number?: number;
    sort?: SortObject;
    pageable?: PageableObject;
    numberOfElements?: number;
    last?: boolean;
    first?: boolean;
    empty?: boolean;
};

