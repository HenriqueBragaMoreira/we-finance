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

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "hsl(12, 76%, 61%)",
  "hsl(173, 58%, 39%)",
  "hsl(197, 37%, 24%)",
  "hsl(43, 74%, 66%)",
  "hsl(27, 87%, 67%)",
  "hsl(215, 28%, 17%)",
  "hsl(358, 75%, 59%)",
];

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

  const { chartConfig, chartData, dynamicStyles } = useMemo(() => {
    if (!data || data.length === 0) {
      return { chartConfig: {}, chartData: [], dynamicStyles: {} };
    }

    const config: ChartConfig = {};
    const styles: Record<string, string> = {};
    const formattedData = data.map((item, index) => {
      const colorKey = item.categoryName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-");
      const color = CHART_COLORS[index % CHART_COLORS.length];

      config[colorKey] = {
        label: item.categoryName,
        color: color,
      };

      styles[`--color-${colorKey}`] = color;

      return {
        categoryName: item.categoryName,
        percentage: item.percentage,
        percentageDisplay: `${item.percentage}%`,
        amount: item.amount,
        fill: `var(--color-${colorKey})`,
      };
    });

    return {
      chartConfig: config,
      chartData: formattedData,
      dynamicStyles: styles,
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
          style={dynamicStyles}
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
