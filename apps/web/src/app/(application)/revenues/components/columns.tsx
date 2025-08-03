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
import type { GetIncomesResponseDataField } from "@/services/incomes/types";
import { masks } from "@/utils/masks";

type useColumnsProps = {
  // biome-ignore lint/suspicious/noExplicitAny: <>
  incomes: any[];
};

export function useColumns({ incomes }: useColumnsProps) {
  const uniqueTypes = [...new Set(incomes.map((item) => item.type))];

  const uniquePaymentMethods = [
    ...new Set(incomes.map((item) => item.paymentMethod)),
  ];

  const columns: ColumnDef<GetIncomesResponseDataField>[] = [
    {
      id: "description",
      accessorKey: "name",
      header: "Descrição",
      cell: ({ row }) => {
        const description = row.original.name;

        return (
          <span className="max-w-80 truncate block" title={description}>
            {description}
          </span>
        );
      },
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
      id: "amount",
      accessorKey: "amount",
      header: "Valor",
      cell: ({ row }) => {
        const value = row.original.amount;
        return <span>{masks.listedMoney(String(value))}</span>;
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
      id: "paymentMethod",
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
      id: "date",
      accessorKey: "date",
      header: "Data",
      cell: ({ row }) => {
        const date = row.original.receivedAt;

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
      id: "person",
      accessorFn: (row) => row.user,
      accessorKey: "user",
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
      id: "status",
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;

        const translatedStatus =
          {
            RECEIVED: "Recebido",
            PENDING: "Pendente",
          }[status] || status;

        return (
          <Badge className="gap-1.5" variant="outline">
            <span
              className={cn(
                "size-1.5 rounded-full",
                status === "RECEIVED" && "bg-emerald-500",
                status === "PENDING" && "bg-amber-500"
              )}
              aria-hidden="true"
            />
            {translatedStatus}
          </Badge>
        );
      },
      meta: {
        label: "Status",
        variant: "multiSelect",
        options: [
          {
            label: "Recebido",
            value: "RECEIVED",
          },
          {
            label: "Pendente",
            value: "PENDING",
          },
        ],
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
