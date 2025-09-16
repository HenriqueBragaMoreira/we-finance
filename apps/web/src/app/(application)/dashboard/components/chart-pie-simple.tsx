"use client";

import { useQuery } from "@tanstack/react-query";
import { parseAsString, useQueryStates } from "nuqs";
import { useMemo } from "react";
import { Pie, PieChart } from "recharts";
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
import { ChartPieSimpleSkeleton } from "./chart-pie-simple-skeleton";

function sanitizeCategoryName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "")
    .replace(/\s+/g, "");
}

export function ChartPieSimple() {
  const [filters] = useQueryStates({
    person: parseAsString.withDefault(""),
    month: parseAsString.withDefault(""),
    year: parseAsString.withDefault(""),
  });

  const { data, isFetching } = useQuery({
    queryKey: ["dashboard-expenses-by-category", filters],
    queryFn: async () => {
      return await dashboardServices.getExpensesByCategory(filters);
    },
  });

  const { chartConfig, chartData } = useMemo(() => {
    if (!data || data.length === 0) {
      return { chartConfig: {}, chartData: [] };
    }

    const config: ChartConfig = {};
    const formattedData = data.map((item) => {
      const sanitizedName = sanitizeCategoryName(item.categoryName);

      config[sanitizedName] = {
        label: item.categoryName,
        color: item.categoryColor,
      };

      return {
        categoryName: item.categoryName,
        percentage: item.percentage,
        percentageDisplay: `${item.percentage}%`,
        amount: item.amount,
        fill: `var(--color-${sanitizedName})`,
      };
    });

    return {
      chartConfig: config,
      chartData: formattedData,
    };
  }, [data]);

  if (isFetching) {
    return <ChartPieSimpleSkeleton />;
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Despesas por Categoria</CardTitle>
        <CardDescription>Distribuição dos gastos do mês</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[400px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel className="percentage" />}
            />
            <Pie data={chartData} dataKey="percentage" nameKey="categoryName" />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
