"use client";

import { categoriesServices } from "@/services/categories";
import { useQuery } from "@tanstack/react-query";
import { parseAsString, useQueryStates } from "nuqs";
import { CategoriesHeaderCards } from "./categories-header-cards";
import { DataTableContainer } from "./data-table-container";

export function CategoriesContainerPage() {
  const [filters] = useQueryStates({
    name: parseAsString.withDefault(""),
    type: parseAsString.withDefault(""),
    color: parseAsString.withDefault(""),
    createdAt: parseAsString.withDefault(""),
    updatedAt: parseAsString.withDefault(""),
    status: parseAsString.withDefault(""),
    page: parseAsString.withDefault("0"),
    rowsPerPage: parseAsString.withDefault("10"),
  });

  const { data, isFetching } = useQuery({
    queryKey: ["get-categories", filters],
    queryFn: async () => {
      return await categoriesServices.get(filters);
    },
  });

  return (
    <>
      <CategoriesHeaderCards data={data} isFetching={isFetching} />

      <DataTableContainer data={data} isFetching={isFetching} />
    </>
  );
}
