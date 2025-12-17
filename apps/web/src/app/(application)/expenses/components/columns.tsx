import { useQueries } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Banknote,
  CalendarIcon,
  CircleDashed,
  DollarSign,
  EllipsisIcon,
  SquarePen,
  Text,
  UserRound,
} from "lucide-react";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { categoriesServices } from "@/services/categories";
import type { GetExpenseResponseDataField } from "@/services/expense/types";
import { paymentMethodsServices } from "@/services/payment-methods";
import { usersServices } from "@/services/users";
import { masks } from "@/utils/masks";
import { DeleteExpenseDialog } from "./delete-expense-dialog";
import { ExpensesActionDialog } from "./expenses-action-dialog";

export function useColumns() {
  const [
    { data: expenseCategories },
    { data: paymentMethods },
    { data: users },
  ] = useQueries({
    queries: [
      {
        queryKey: ["get-categories", "EXPENSE"],
        queryFn: async () => await categoriesServices.get({ type: "EXPENSE" }),
      },
      {
        queryKey: ["get-payment-methods"],
        queryFn: async () =>
          await paymentMethodsServices.get({ isActive: true }),
      },
      {
        queryKey: ["get-users"],
        queryFn: async () => await usersServices.get(),
      },
    ],
  });

  const columns: ColumnDef<GetExpenseResponseDataField>[] = useMemo(
    () => [
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
        id: "expenseType",
        accessorKey: "expenseType",
        header: "Tipo de Despesa",
        cell: ({ row }) => {
          const type = row.original.expenseType;

          const translatedType =
            {
              FIXED: "Fixa",
              VARIABLE: "Variável",
            }[type] || type;

          return (
            <Badge className="gap-1.5" variant="outline">
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  type === "FIXED" && "bg-blue-300",
                  type === "VARIABLE" && "bg-yellow-300"
                )}
                aria-hidden="true"
              />
              {translatedType}
            </Badge>
          );
        },
        meta: {
          label: "Tipo de Despesa",
          variant: "multiSelect",
          options: [
            {
              label: "Fixa",
              value: "FIXED",
            },
            {
              label: "Variável",
              value: "VARIABLE",
            },
          ],
          icon: CircleDashed,
          filterType: "multiText",
        },
        enableColumnFilter: true,
      },
      {
        id: "category",
        accessorKey: "category",
        header: "Categoria",
        cell: ({ row }) => <>{row.original.category.name}</>,
        meta: {
          label: "Categoria",
          variant: "multiSelect",
          options: expenseCategories?.data.map((type) => ({
            label: type.name,
            value: type.name,
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
        accessorKey: "paymentMethod",
        header: "Método de Pagamento",
        cell: ({ row }) => <>{row.original.paymentMethod.name}</>,
        meta: {
          label: "Método de Pagamento",
          variant: "multiSelect",
          options: paymentMethods?.data.map((method) => ({
            label: method.name,
            value: method.name,
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
          const date = row.original.spentAt;

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
        header: "Pessoa",
        cell: ({ row }) => <>{row.original.user.name}</>,
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
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;

          const translatedStatus =
            {
              PAID: "Pago",
              PENDING: "Pendente",
            }[status] || status;

          return (
            <Badge className="gap-1.5" variant="outline">
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  status === "PAID" && "bg-emerald-500",
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
              label: "Pago",
              value: "PAID",
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
        cell: ({ row }) => {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" aria-label="Open edit menu">
                  <EllipsisIcon size={16} aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <ExpensesActionDialog expense={row.original}>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <SquarePen
                      size={16}
                      className="opacity-60"
                      aria-hidden="true"
                    />
                    Editar
                  </DropdownMenuItem>
                </ExpensesActionDialog>

                <DeleteExpenseDialog expenseId={row.original.id} />
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [expenseCategories?.data, paymentMethods?.data, users?.data]
  );

  return { columns };
}
