import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { categoriesServices } from "@/services/categories";
import type { GetInvestmentResponseDataField } from "@/services/investment/types";
import { usersServices } from "@/services/users";
import { masks } from "@/utils/masks";
import { useQueries } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Banknote,
  CalendarIcon,
  CircleDashed,
  EllipsisIcon,
  SquarePen,
  Trash2,
  UserRound,
} from "lucide-react";

export function useColumns() {
  const [{ data: investmentCategories }, { data: users }] = useQueries({
    queries: [
      {
        queryKey: ["get-categories", "INVESTMENT"],
        queryFn: async () =>
          await categoriesServices.get({ type: "INVESTMENT" }),
      },
      {
        queryKey: ["get-users"],
        queryFn: async () => await usersServices.get(),
      },
    ],
  });

  const columns: ColumnDef<GetInvestmentResponseDataField>[] = [
    {
      id: "notes",
      accessorKey: "notes",
      header: "Descrição",
      meta: {
        label: "Descrição",
        variant: "text",
        icon: CircleDashed,
        filterType: "text",
      },
      enableColumnFilter: true,
    },
    {
      id: "categoryId",
      accessorKey: "category",
      header: "Categoria",
      meta: {
        label: "Categoria",
        variant: "multiSelect",
        options: investmentCategories?.data.map((category) => ({
          label: category.name,
          value: category.id,
        })),
        icon: CircleDashed,
        filterType: "multiText",
      },
      enableColumnFilter: true,
    },
    {
      id: "amount",
      accessorKey: "amount",
      header: "Valor Investido",
      cell: ({ row }) => {
        return (
          <span className="text-purple-600 font-semibold">
            {masks.money(row.original.amount)}
          </span>
        );
      },
      meta: {
        label: "Valor Investido",
        variant: "text",
        icon: Banknote,
        filterType: "text",
      },
      enableColumnFilter: true,
    },
    {
      id: "investedAt",
      accessorKey: "investedAt",
      header: "Data",
      cell: ({ row }) => {
        const date = row.original.investedAt;
        return (
          <span>
            {new Date(date).toLocaleDateString("pt-BR", { timeZone: "UTC" })}
          </span>
        );
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
      id: "person",
      accessorFn: (row) => row.user,
      accessorKey: "user",
      header: "Pessoa",
      meta: {
        label: "Pessoa",
        variant: "select",
        options: users?.data.map((user) => ({
          label: user.name,
          value: user.id,
        })),
        icon: UserRound,
        filterType: "text",
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
