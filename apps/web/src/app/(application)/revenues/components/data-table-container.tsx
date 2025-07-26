"use client";

import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { HandCoins } from "lucide-react";
import { incomes } from "../data/incomes";
import { useColumns } from "./columns";

export function DataTableContainer() {
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
