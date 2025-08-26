/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BoardDto_Response } from './BoardDto_Response';
import type { PageableObject } from './PageableObject';
import type { SortObject } from './SortObject';
export type PageBoardDto_Response = {
  totalPages?: number;
  totalElements?: number;
  size?: number;
  content?: Array<BoardDto_Response>;
  number?: number;
  sort?: SortObject;
  pageable?: PageableObject;
  numberOfElements?: number;
  last?: boolean;
  first?: boolean;
  empty?: boolean;
};
