"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { dashboardServices } from "@/services/dashboard";
import { useQuery } from "@tanstack/react-query";
import { parseAsString, useQueryStates } from "nuqs";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { ChartBarMultipleSkeleton } from "./chart-bar-multiple-skeleton";

const chartConfig = {
  revenues: {
    label: "Receitas",
    color: "#03FC0F",
  },
  expenses: {
    label: "Despesas",
    color: "#FC030F",
  },
} satisfies ChartConfig;

export function ChartBarMultiple() {
  const [filters] = useQueryStates({
    person: parseAsString.withDefault(""),
    month: parseAsString.withDefault(""),
    year: parseAsString.withDefault(""),
  });

  const { data, isFetching } = useQuery({
    queryKey: ["dashboard-revenues-vs-expenses", filters],
    queryFn: async () => {
      return await dashboardServices.getRevenuesVsExpenses(filters);
    },
  });

  if (isFetching) {
    return <ChartBarMultipleSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Receitas vs Despesas</CardTitle>
        <CardDescription>{data?.period}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data?.data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="revenues" fill="var(--color-revenues)" radius={4} />
            <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
