"use client";

import { PiggyBank } from "lucide-react";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { investments } from "../data/investments";
import { useColumns } from "./columns";

export function DataTableContainer() {
  const { columns } = useColumns({ investments });

  return (
    <DataTable
      data={investments}
      totalLength={investments.length}
      columns={columns}
      action={
        <Button
          className="bg-purple-600 hover:bg-purple-600/90 text-white"
          size="sm"
        >
          <PiggyBank />
          Adicionar investimento
        </Button>
      }
    />
  );
}
