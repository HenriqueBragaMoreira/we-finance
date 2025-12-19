import type { ColumnDef } from "@tanstack/react-table";
import {
  CalendarIcon,
  CircleDashed,
  EllipsisIcon,
  SquarePen,
  Text,
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
import type { GetPaymentMethodsResponseDataField } from "@/services/payment-methods/types";
import { ChangePaymentMethodStatus } from "./change-payment-method-status";
import { DeletePaymentMethodDialog } from "./delete-payment-method-dialog";
import { PaymentMethodsActionDialog } from "./payment-methods-action-dialog";

export function useColumns() {
  const columns: ColumnDef<GetPaymentMethodsResponseDataField>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: "Nome",
      cell: ({ row }) => {
        const name = row.original.name;

        return (
          <span className="max-w-80 truncate block" title={name}>
            {name}
          </span>
        );
      },
      meta: {
        label: "Nome",
        variant: "text",
        icon: Text,
        filterType: "text",
      },
      enableColumnFilter: true,
    },
    {
      id: "createdAt",
      accessorKey: "createdAt",
      header: "Criado em",
      cell: ({ row }) => {
        const value = row.original.createdAt;
        return (
          <span>
            {new Date(value).toLocaleDateString("pt-BR", { timeZone: "UTC" })}
          </span>
        );
      },
      meta: {
        label: "Criado em",
        variant: "dateRange",
        icon: CalendarIcon,
        filterType: "text",
      },
      enableColumnFilter: true,
    },
    {
      id: "updatedAt",
      accessorKey: "updatedAt",
      header: "Atualizado em",
      cell: ({ row }) => {
        const value = row.original.updatedAt;
        return (
          <span>
            {new Date(value).toLocaleDateString("pt-BR", { timeZone: "UTC" })}
          </span>
        );
      },
      meta: {
        label: "Atualizado em",
        variant: "dateRange",
        icon: CalendarIcon,
        filterType: "text",
      },
      enableColumnFilter: true,
    },
    {
      id: "status",
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.original.isActive;

        return (
          <Badge className="gap-1.5" variant="outline">
            <span
              className={cn(
                "size-1.5 rounded-full",
                isActive && "bg-emerald-500",
                !isActive && "bg-red-500"
              )}
              aria-hidden="true"
            />
            {isActive ? "Ativo" : "Inativo"}
          </Badge>
        );
      },
      meta: {
        label: "Status",
        variant: "multiSelect",
        options: [
          {
            label: "Ativo",
            value: "true",
          },
          {
            label: "Inativo",
            value: "false",
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
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" aria-label="Open edit menu">
                <EllipsisIcon size={16} aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <PaymentMethodsActionDialog paymentMethod={row.original}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <SquarePen
                    size={16}
                    className="opacity-60"
                    aria-hidden="true"
                  />
                  Editar
                </DropdownMenuItem>
              </PaymentMethodsActionDialog>

              <ChangePaymentMethodStatus
                paymentMethodId={row.original.id}
                isActive={row.original.isActive}
              />

              <DeletePaymentMethodDialog paymentMethodId={row.original.id} />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return { columns };
}
