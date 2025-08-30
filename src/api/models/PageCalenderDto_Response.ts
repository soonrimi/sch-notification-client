/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CalenderDto_Response } from './CalenderDto_Response';
import type { PageableObject } from './PageableObject';
import type { SortObject } from './SortObject';
export type PageCalenderDto_Response = {
    totalPages?: number;
    totalElements?: number;
    number?: number;
    size?: number;
    numberOfElements?: number;
    content?: Array<CalenderDto_Response>;
    sort?: SortObject;
    first?: boolean;
    last?: boolean;
    pageable?: PageableObject;
    empty?: boolean;
};

