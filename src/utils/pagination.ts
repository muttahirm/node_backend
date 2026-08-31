import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
} from '../constants/application.constants.js';

export interface PaginationInput {
  page: number;
  limit: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export const normalizePagination = (pageInput?: number, limitInput?: number): PaginationInput => {
  const page = Math.max(pageInput ?? DEFAULT_PAGE, 1);

  const limit = Math.min(Math.max(limitInput ?? DEFAULT_PAGE_SIZE, 1), MAX_PAGE_SIZE);

  return {
    page,
    limit,
  };
};

export const calculateSkip = ({ page, limit }: PaginationInput): number => {
  return (page - 1) * limit;
};

export const createPaginationMeta = (
  pagination: PaginationInput,
  totalItems: number,
): PaginationMeta => {
  const totalPages = Math.ceil(totalItems / pagination.limit);

  return {
    page: pagination.page,
    limit: pagination.limit,
    totalItems,
    totalPages,
    hasNextPage: pagination.page < totalPages,
    hasPreviousPage: pagination.page > 1,
  };
};
