export interface PaginationParams {
  init?: string;
  limit?: string;
}

export interface PaginationResult {
  page: number;
  pageSize: number | undefined;
  skip: number | undefined;
}

export function calculatePagination(
  params: PaginationParams
): PaginationResult {
  const page = Number(params.init) || 0;
  const pageSize = params.limit ? Number(params.limit) : undefined;
  const skip = pageSize ? page * pageSize : undefined;

  return {
    page,
    pageSize,
    skip,
  };
}
