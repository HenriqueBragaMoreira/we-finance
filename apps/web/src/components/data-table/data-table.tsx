"use client";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DataTableFilter } from "@/components/data-table/data-table-filter";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { Pagination } from "@/components/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePagination } from "@/hooks/use-pagination";
import { DataTableSkeleton } from "./data-table-skeleton";

type DataTableProps<TData, TValue> = {
  data: TData[] | undefined;
  totalLength: number;
  columns: ColumnDef<TData, TValue>[];
  action: React.JSX.Element;
};

export function DataTable<TData, TValue>({
  data,
  totalLength,
  columns,
  action,
}: DataTableProps<TData, TValue>) {
  const paginationHook = usePagination();

  const pageCount = Math.ceil(totalLength / paginationHook.rowsPerPage);

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(totalLength / paginationHook.rowsPerPage),
    state: {
      pagination: {
        pageIndex: paginationHook.page,
        pageSize: paginationHook.rowsPerPage,
      },
    },
    onPaginationChange() {
      paginationHook.handleChangePage(table.getState().pagination.pageIndex);
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 justify-between">
          {action}

          <div className="flex items-center justify-end gap-2">
            <DataTableFilter table={table} align="end" />

            <DataTableViewOptions table={table} />
          </div>
        </div>

        {!data ? (
          <DataTableSkeleton rows={10} columns={8} />
        ) : (
          <div className="rounded-md border sm:*:data-[slot=table-container]:h-[calc(100vh-26rem)]">
            <Table className="h-full">
              <TableHeader className="sticky top-0 bg-background z-30">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      Sem resultados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <Pagination paginationTable={paginationHook} pageCount={pageCount} />
    </div>
  );
}
