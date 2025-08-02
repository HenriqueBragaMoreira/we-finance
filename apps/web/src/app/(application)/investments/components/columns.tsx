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
import { masks } from "@/utils/masks";
import type { InvestmentType } from "../data/investments";

export function useColumns({ investments }: { investments: InvestmentType[] }) {
  const uniqueTypes = [...new Set(investments.map((item) => item.type))];

  const columns: ColumnDef<InvestmentType>[] = [
    {
      id: "type",
      accessorKey: "type",
      header: "Tipo",
      meta: {
        label: "Tipo",
        variant: "multiSelect",
        options: uniqueTypes.map((type) => ({
          label: type,
          value: type,
        })),
        icon: CircleDashed,
        filterType: "multiText",
      },
      enableColumnFilter: true,
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
      meta: {
        label: "Valor Investido",
        variant: "text",
        icon: Banknote,
        filterType: "text",
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
      accessorKey: "expectedReturn",
      header: "Retorno Esperado",
      cell: ({ row }) => {
        return (
          <Badge variant="outline" className="text-green-600">
            {row.original.expectedReturn}
          </Badge>
        );
      },
      meta: {
        label: "Retorno Esperado",
        variant: "text",
        icon: DollarSign,
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
      accessorKey: "notes",
      header: "Observações",
      meta: {
        label: "Observações",
        variant: "text",
        icon: Text,
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
