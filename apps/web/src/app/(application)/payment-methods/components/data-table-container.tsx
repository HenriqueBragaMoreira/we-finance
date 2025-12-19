"use client";

import { CreditCard } from "lucide-react";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { Button } from "@/components/ui/button";
import type { GetPaymentMethodsResponse } from "@/services/payment-methods/types";
import { useColumns } from "./columns";
import { PaymentMethodsActionDialog } from "./payment-methods-action-dialog";

type DataTableContainerProps = {
  data: GetPaymentMethodsResponse | undefined;
  isFetching: boolean;
};

export function DataTableContainer({
  data,
  isFetching,
}: DataTableContainerProps) {
  const { columns } = useColumns();

  if (!data || isFetching) {
    return <DataTableSkeleton rows={10} columns={8} />;
  }

  return (
    <DataTable
      data={data?.data}
      totalLength={data?.totalLength || 0}
      columns={columns}
      action={
        <PaymentMethodsActionDialog>
          <Button
            className="bg-blue-600 hover:bg-blue-600/90 text-white"
            size="sm"
          >
            <CreditCard />
            Adicionar método de pagamento
          </Button>
        </PaymentMethodsActionDialog>
      }
    />
  );
}
