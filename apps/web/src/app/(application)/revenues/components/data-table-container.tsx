"use client";

import { useQuery } from "@tanstack/react-query";
import { HandCoins } from "lucide-react";
import { parseAsString, useQueryStates } from "nuqs";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { incomesServices } from "@/services/incomes";
import { useColumns } from "./columns";
import { RevenueActionDialog } from "./revenue-action-dialog";

export function DataTableContainer() {
  const [filters] = useQueryStates({
    description: parseAsString.withDefault(""),
    incomeType: parseAsString.withDefault(""),
    category: parseAsString.withDefault(""),
    amount: parseAsString.withDefault(""),
    paymentMethod: parseAsString.withDefault(""),
    status: parseAsString.withDefault(""),
    date: parseAsString.withDefault(""),
    person: parseAsString.withDefault(""),
    page: parseAsString.withDefault("0"),
    rowsPerPage: parseAsString.withDefault("10"),
  });

  const { data } = useQuery({
    queryKey: ["get-incomes", filters],
    queryFn: async () => {
      return incomesServices.get(filters);
    },
  });

  const { columns } = useColumns();

  return (
    <DataTable
      data={data?.data}
      totalLength={data?.totalLength || 0}
      columns={columns}
      action={
        <RevenueActionDialog>
          <Button variant="success" size="sm">
            <HandCoins />
            Adicionar receita
          </Button>
        </RevenueActionDialog>
      }
    />
  );
}
