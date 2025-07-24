import type { ColumnDef } from "@tanstack/react-table";
import { EllipsisIcon, SquarePen, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { masks } from "@/utils/masks";
import type { InvestmentType } from "../data/investments";

export const columns: ColumnDef<InvestmentType>[] = [
  {
    accessorKey: "type",
    header: "Tipo",
  },
  {
    accessorKey: "investedAmount",
    header: "Valor Investido",
    cell: ({ row }) => {
      return (
        <span className="text-purple-600 font-semibold">
          {masks.money(row.original.investedAmount)}
        </span>
      );
    },
  },
  {
    accessorKey: "date",
    header: "Data",
    cell: ({ row }) => {
      const date = row.original.date;
      return <span>{new Date(date).toLocaleDateString("pt-BR")}</span>;
    },
  },
  {
    accessorKey: "expectedReturn",
    header: "Retorno Esperado",
    cell: ({ row }) => {
      return (
        <Badge variant="outline" className="text-green-600">
          {row.original.expectedReturn}
        </Badge>
      );
    },
  },
  {
    accessorKey: "person",
    header: "Pessoa",
  },
  {
    accessorKey: "notes",
    header: "Observações",
  },
  {
    id: "action",
    enableHiding: false,
    cell: () => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" aria-label="Open edit menu">
              <EllipsisIcon size={16} aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <SquarePen size={16} className="opacity-60" aria-hidden="true" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Trash2
                size={16}
                className="text-destructive opacity-60"
                aria-hidden="true"
              />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
