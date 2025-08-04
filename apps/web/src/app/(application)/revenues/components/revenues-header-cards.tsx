"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { incomesServices } from "@/services/incomes";
import { masks } from "@/utils/masks";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp } from "lucide-react";
import { RevenuesHeaderCardsSkeleton } from "./revenues-header-cards-skeleton";

export function RevenuesHeaderCards() {
  const { data, isLoading } = useQuery({
    queryKey: ["monthly-stats"],
    queryFn: async () => {
      return await incomesServices.getMonthlyStats();
    },
  });

  if (isLoading) {
    return <RevenuesHeaderCardsSkeleton />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 *:data-[slot=card]:gap-2 **:data-[slot=card-header]:pb-0">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Receitas
          </CardTitle>
          <TrendingUp className="size-6 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {masks.listedMoney(String(data?.totalRevenues))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recebidas</CardTitle>
          <TrendingUp className="size-6 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {masks.listedMoney(String(data?.received))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
          <TrendingUp className="size-6 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {masks.listedMoney(String(data?.pending))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
