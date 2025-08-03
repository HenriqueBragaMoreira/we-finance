"use client";

import { CreditCard } from "lucide-react";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { expenses } from "../data/expenses";
import { useColumns } from "./columns";

export function DataTableContainer() {
  const { columns } = useColumns({ expenses });

  return (
    <DataTable
      data={expenses}
      columns={columns}
      totalLength={expenses.length}
      action={
        <Button variant="destructive" size="sm">
          <CreditCard />
          Adicionar despesa
        </Button>
      }
    />
  );
}
