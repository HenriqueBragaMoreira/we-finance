"use client";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { EllipsisIcon, InfoIcon } from "lucide-react";
import { Fragment } from "react";
import { EditInstallmentDialog } from "@/app/(application)/expenses/components/edit-installment-dialog";
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
import { cn } from "@/lib/utils";
import type { GetExpenseResponseDataField } from "@/services/expense/types";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
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
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: (row) =>
      Boolean(
        (row.original as GetExpenseResponseDataField).installments.length > 0
      ),
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
                    <Fragment key={row.id}>
                      <TableRow data-state={row.getIsSelected() && "selected"}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                      {row.getIsExpanded() && (
                        <>
                          <TableRow className="bg-accent/40">
                            <TableCell colSpan={row.getVisibleCells().length}>
                              <div className="flex justify-between py-2 pl-4 pr-20 text-foreground font-medium">
                                <p>Número da parcela</p>
                                <p>Valor</p>
                                <p>Data de vencimento</p>
                                <p>Status</p>
                                <div />
                              </div>
                            </TableCell>
                          </TableRow>
                          {(
                            row.original as GetExpenseResponseDataField
                          ).installments.map((installment) => (
                            <TableRow
                              key={installment.id}
                              className="bg-accent/20"
                            >
                              <TableCell colSpan={row.getVisibleCells().length}>
                                <div className="flex justify-between items-center py-2 text-primary/80">
                                  <div className="flex">
                                    <span
                                      aria-hidden="true"
                                      className="me-3 mt-0.5 flex w-7 shrink-0 justify-center"
                                    >
                                      <InfoIcon
                                        className="opacity-60"
                                        size={16}
                                      />
                                    </span>

                                    <p className="text-sm">
                                      Parcela Nº {installment.number}
                                    </p>
                                  </div>

                                  <p className="text-sm">
                                    R$ {installment.amount}
                                  </p>

                                  <p className="text-sm">
                                    {format(
                                      new Date(installment.dueDate),
                                      "dd/MM/yyyy"
                                    )}
                                  </p>

                                  <Badge
                                    className="gap-1.5 w-[86px]"
                                    variant="outline"
                                  >
                                    <span
                                      className={cn(
                                        "size-1.5 rounded-full",
                                        installment.status === "PENDING" &&
                                          "bg-amber-500",
                                        installment.status === "PAID" &&
                                          "bg-emerald-500"
                                      )}
                                      aria-hidden="true"
                                    />
                                    {installment.status === "PENDING"
                                      ? "Pendente"
                                      : "Pago"}
                                  </Badge>

                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        aria-label="Open edit menu"
                                      >
                                        <EllipsisIcon
                                          size={16}
                                          aria-hidden="true"
                                        />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                      <EditInstallmentDialog
                                        data={installment}
                                      />
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </>
                      )}
                    </Fragment>
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
