"use client";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { Button } from "@/components/ui/button";
import { expenseServices } from "@/services/expense";
import { useQuery } from "@tanstack/react-query";
import { CreditCard } from "lucide-react";
import { parseAsString, useQueryStates } from "nuqs";
import { useColumns } from "./columns";
import { ExpensesActionDialog } from "./expenses-action-dialog";

export function DataTableContainer() {
  const [filters] = useQueryStates({
    description: parseAsString.withDefault(""),
    expenseType: parseAsString.withDefault(""),
    category: parseAsString.withDefault(""),
    amount: parseAsString.withDefault(""),
    paymentMethod: parseAsString.withDefault(""),
    status: parseAsString.withDefault(""),
    date: parseAsString.withDefault(""),
    person: parseAsString.withDefault(""),
    page: parseAsString.withDefault("0"),
    rowsPerPage: parseAsString.withDefault("10"),
  });

  const { data, isFetching } = useQuery({
    queryKey: ["get-expense", filters],
    queryFn: async () => {
      return expenseServices.get(filters);
    },
  });

  const { columns } = useColumns();

  if (!data || isFetching) {
    return <DataTableSkeleton rows={10} columns={8} />;
  }

  return (
    <DataTable
      data={data.data}
      columns={columns}
      totalLength={data.total}
      action={
        <ExpensesActionDialog>
          <Button variant="destructive" size="sm">
            <CreditCard />
            Adicionar despesa
          </Button>
        </ExpensesActionDialog>
      }
    />
  );
}
