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
  size?: number;
  content?: Array<Response>;
  number?: number;
  sort?: SortObject;
  pageable?: PageableObject;
  first?: boolean;
  numberOfElements?: number;
  last?: boolean;
  empty?: boolean;
};
