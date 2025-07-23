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
import { cn } from "@/lib/utils";
import { masks } from "@/utils/masks";
import type { ExpenseType } from "../data/expenses";

export const columns: ColumnDef<ExpenseType>[] = [
  {
    accessorKey: "name",
    header: "Descrição",
  },
  {
    accessorKey: "category",
    header: "Categoria",
  },
  {
    accessorKey: "value",
    header: "Valor",
    cell: ({ row }) => {
      const value = row.original.amount;
      return <span>{masks.money(String(value))}</span>;
    },
  },
  {
    accessorKey: "paymentMethod",
    header: "Método de Pagamento",
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
    accessorKey: "person",
    header: "Pessoa",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;

      return (
        <Badge className="gap-1.5" variant="outline">
          <span
            className={cn(
              "size-1.5 rounded-full",
              status === "Pago" && "bg-emerald-500",
              status === "Pendente" && "bg-amber-500"
            )}
            aria-hidden="true"
          />
          {status}
        </Badge>
      );
    },
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
