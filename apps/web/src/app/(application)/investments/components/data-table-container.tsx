"use client";

import { useQuery } from "@tanstack/react-query";
import { PiggyBank } from "lucide-react";
import { parseAsString, useQueryStates } from "nuqs";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { investmentServices } from "@/services/investment";
import { useColumns } from "./columns";
import { InvestmentActionDialog } from "./investment-action-dialog";

export function DataTableContainer() {
  const [filters] = useQueryStates({
    notes: parseAsString.withDefault(""),
    categoryId: parseAsString.withDefault(""),
    amount: parseAsString.withDefault(""),
    investedAt: parseAsString.withDefault(""),
    person: parseAsString.withDefault(""),
    page: parseAsString.withDefault("0"),
    rowsPerPage: parseAsString.withDefault("10"),
  });

  const { data } = useQuery({
    queryKey: ["get-investments", filters],
    queryFn: async () => {
      return investmentServices.get(filters);
    },
  });

  const { columns } = useColumns();

  return (
    <DataTable
      data={data?.data}
      totalLength={data?.totalLength || 0}
      columns={columns}
      action={
        <InvestmentActionDialog>
          <Button
            className="bg-purple-600 hover:bg-purple-600/90 text-white"
            size="sm"
          >
            <PiggyBank />
            Adicionar investimento
          </Button>
        </InvestmentActionDialog>
      }
    />
  );
}
