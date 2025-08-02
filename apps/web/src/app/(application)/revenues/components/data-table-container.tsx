"use client";

import { useQuery } from "@tanstack/react-query";
import { HandCoins } from "lucide-react";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { incomesServices } from "@/services/incomes";
import { incomes } from "../data/incomes";
import { useColumns } from "./columns";

export function DataTableContainer() {
  const { data } = useQuery({
    queryKey: ["get-incomes"],
    queryFn: async () => await incomesServices.get(),
  });

  const { columns } = useColumns({ incomes });

  return (
    <DataTable
      data={incomes}
      columns={columns}
      action={
        <Button variant="success" size="sm">
          <HandCoins />
          Adicionar receita
        </Button>
      }
    />
  );
}
