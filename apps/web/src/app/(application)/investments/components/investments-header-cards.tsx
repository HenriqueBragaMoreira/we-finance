"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { investmentServices } from "@/services/investment";
import { masks } from "@/utils/masks";
import { useQuery } from "@tanstack/react-query";
import { PiggyBank, TrendingUp } from "lucide-react";
import { InvestmentsHeaderCardsSkeleton } from "./investments-header-cards-skeleton";

export function InvestmentsHeaderCards() {
  const { data, isFetching } = useQuery({
    queryKey: ["investment-monthly-stats"],
    queryFn: async () => {
      return await investmentServices.getMonthlyStats();
    },
  });

  if (isFetching) {
    return <InvestmentsHeaderCardsSkeleton />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 *:data-[slot=card]:gap-2 **:data-[slot=card-header]:pb-0">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Investido</CardTitle>
          <PiggyBank className="size-6 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">
            {masks.listedMoney(String(data?.totalInvestments))}
          </div>
        </CardContent>
      </Card>

      {data?.userStats.map((user) => (
        <Card key={user.name}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{user.name}</CardTitle>
            <TrendingUp
              className={cn(
                "size-6",
                user.name === "Henrique Braga" && "text-blue-600",
                user.name === "Gislaine Santos" && "text-pink-600"
              )}
            />
          </CardHeader>
          <CardContent>
            <div
              className={cn(
                "text-2xl font-bold",
                user.name === "Gislaine Santos" && "text-pink-600",
                user.name === "Henrique Braga" && "text-blue-600"
              )}
            >
              {masks.listedMoney(String(user.amount))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
