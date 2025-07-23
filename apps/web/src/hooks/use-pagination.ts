"use client";

import { useState } from "react";

export type UsePaginationReturn = {
  page: number;
  rowsPerPage: number;
  firstItem: number;
  handleChangePage: (newPage: number) => void;
  handleChangeRowsPerPage: (rowsPerPage: number) => void;
  resetPage: () => void;
};

export function usePagination(): UsePaginationReturn {
  const [pageQuery, setPageQuery] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  function handleChangePage(newPage: number): void {
    setPageQuery(newPage);
  }

  function handleChangeRowsPerPage(rowsPerPage: number): void {
    setRowsPerPage(rowsPerPage);
    setPageQuery(0);
  }

  function resetPage(): void {
    setPageQuery(0);
  }

  const firstItem = pageQuery * rowsPerPage;

  return {
    page: pageQuery,
    rowsPerPage,
    firstItem,
    handleChangePage,
    handleChangeRowsPerPage,
    resetPage,
  };
}
