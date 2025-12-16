"use client";

import { Tag } from "lucide-react";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { Button } from "@/components/ui/button";
import type { GetCategoriesResponse } from "@/services/categories/types";
import { CategoriesActionDialog } from "./categories-action-dialog";
import { useColumns } from "./columns";

type DataTableContainerProps = {
  data: GetCategoriesResponse | undefined;
  isFetching: boolean;
};

export function DataTableContainer({
  data,
  isFetching,
}: DataTableContainerProps) {
  const { columns } = useColumns();

  if (!data || isFetching) {
    return <DataTableSkeleton rows={10} columns={8} />;
  }

  return (
    <DataTable
      data={data?.data}
      totalLength={data?.totalLength || 0}
      columns={columns}
      action={
        <CategoriesActionDialog>
          <Button
            className="bg-blue-600 hover:bg-blue-600/90 text-white"
            size="sm"
          >
            <Tag />
            Adicionar categoria
          </Button>
        </CategoriesActionDialog>
      }
    />
  );
}
