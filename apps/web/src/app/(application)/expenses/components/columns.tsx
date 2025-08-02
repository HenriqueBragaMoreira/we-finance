import type { ColumnDef } from "@tanstack/react-table";
import {
  Banknote,
  CalendarIcon,
  CircleDashed,
  DollarSign,
  EllipsisIcon,
  SquarePen,
  Text,
  Trash2,
  UserRound,
} from "lucide-react";
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

export function useColumns({ expenses }: { expenses: ExpenseType[] }) {
  const uniqueCategories = [...new Set(expenses.map((item) => item.category))];

  const uniquePaymentMethods = [
    ...new Set(expenses.map((item) => item.paymentMethod)),
  ];

  const uniqueStatus = [...new Set(expenses.map((item) => item.status))];

  const columns: ColumnDef<ExpenseType>[] = [
    {
      id: "description",
      accessorKey: "name",
      header: "Descrição",
      meta: {
        label: "Descrição",
        variant: "text",
        icon: Text,
        filterType: "text",
      },
      enableColumnFilter: true,
    },
    {
      id: "category",
      accessorKey: "category",
      header: "Categoria",
      meta: {
        label: "Categoria",
        variant: "multiSelect",
        options: uniqueCategories.map((category) => ({
          label: category,
          value: category,
        })),
        icon: CircleDashed,
        filterType: "multiText",
      },
      enableColumnFilter: true,
    },
    {
      id: "value",
      accessorKey: "value",
      header: "Valor",
      cell: ({ row }) => {
        const value = row.original.amount;
        return <span>{masks.money(String(value))}</span>;
      },
      meta: {
        label: "Valor",
        variant: "text",
        icon: Banknote,
        filterType: "text",
      },
      enableColumnFilter: true,
    },
    {
      accessorKey: "paymentMethod",
      header: "Método de Pagamento",
      meta: {
        label: "Método de Pagamento",
        variant: "multiSelect",
        options: uniquePaymentMethods.map((method) => ({
          label: method,
          value: method,
        })),
        icon: DollarSign,
        filterType: "multiText",
      },
      enableColumnFilter: true,
    },
    {
      accessorKey: "date",
      header: "Data",
      cell: ({ row }) => {
        const date = row.original.date;
        return <span>{new Date(date).toLocaleDateString("pt-BR")}</span>;
      },
      meta: {
        label: "Data",
        variant: "dateRange",
        icon: CalendarIcon,
        filterType: "text",
      },
      enableColumnFilter: true,
    },
    {
      accessorKey: "person",
      header: "Pessoa",
      meta: {
        label: "Pessoa",
        variant: "text",
        icon: UserRound,
        filterType: "text",
      },
      enableColumnFilter: true,
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
      meta: {
        label: "Status",
        variant: "multiSelect",
        options: uniqueStatus.map((status) => ({
          label: status,
          value: status,
        })),
        icon: CircleDashed,
        filterType: "multiText",
      },
      enableColumnFilter: true,
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
                <SquarePen
                  size={16}
                  className="opacity-60"
                  aria-hidden="true"
                />
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

  return { columns };
}
