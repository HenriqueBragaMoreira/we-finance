"use client";

import { CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { GetPaymentMethodsResponse } from "@/services/payment-methods/types";
import { PaymentMethodsHeaderCardsSkeleton } from "./payment-methods-header-cards-skeleton";

type PaymentMethodsHeaderCardsProps = {
  data: GetPaymentMethodsResponse | undefined;
  isFetching: boolean;
};

export function PaymentMethodsHeaderCards({
  data,
  isFetching,
}: PaymentMethodsHeaderCardsProps) {
  if (isFetching) {
    return <PaymentMethodsHeaderCardsSkeleton />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 *:data-[slot=card]:gap-2 **:data-[slot=card-header]:pb-0">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Métodos de Pagamento
          </CardTitle>
          <CreditCard className="size-6 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {data?.totalLength}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ativos</CardTitle>
          <CreditCard className="size-6 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {data?.activeCount}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Inativos</CardTitle>
          <CreditCard className="size-6 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {data?.inactiveCount}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
