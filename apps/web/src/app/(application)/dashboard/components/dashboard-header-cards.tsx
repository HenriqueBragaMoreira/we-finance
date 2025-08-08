"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardServices } from "@/services/dashboard";
import { masks } from "@/utils/masks";
import { useQuery } from "@tanstack/react-query";
import { DollarSign, PiggyBank, TrendingDown, TrendingUp } from "lucide-react";
import { parseAsString, useQueryStates } from "nuqs";
import { DashboardHeaderCardsSkeleton } from "./dashboard-header-cards-skeleton";

export function DashboardHeaderCards() {
  const [filters] = useQueryStates({
    person: parseAsString.withDefault(""),
    month: parseAsString.withDefault(""),
    year: parseAsString.withDefault(""),
  });

  const { data, isFetching } = useQuery({
    queryKey: ["dashboard-summary-cards", filters],
    queryFn: async () => {
      return await dashboardServices.getSummaryCards(filters);
    },
  });

  if (isFetching) {
    return <DashboardHeaderCardsSkeleton />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 *:data-[slot=card]:gap-2 **:data-[slot=card-header]:pb-0">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Receitas</CardTitle>
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
          <CardTitle className="text-sm font-medium">Despesas</CardTitle>
          <TrendingDown className="size-6 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {masks.listedMoney(String(data?.totalExpenses))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Saldo</CardTitle>
          <DollarSign className="size-6 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {masks.listedMoney(String(data?.balance))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Investimentos</CardTitle>
          <PiggyBank className="size-6 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">
            {masks.listedMoney(String(data?.totalInvestments))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
