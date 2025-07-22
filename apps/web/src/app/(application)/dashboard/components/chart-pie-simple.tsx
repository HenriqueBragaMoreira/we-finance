"use client";

import { TrendingUp } from "lucide-react";
import { Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { browser: "Alimentação", visitors: 275, fill: "var(--color-food)" },
  { browser: "Moradia", visitors: 200, fill: "var(--color-housing)" },
  { browser: "Transporte", visitors: 187, fill: "var(--color-transport)" },
  { browser: "Saúde", visitors: 173, fill: "var(--color-health)" },
  { browser: "Outros", visitors: 90, fill: "var(--color-other)" },
];

const chartConfig = {
  food: {
    label: "Alimentação",
    color: "var(--chart-1)",
  },
  housing: {
    label: "Moradia",
    color: "var(--chart-2)",
  },
  transport: {
    label: "Transporte",
    color: "var(--chart-3)",
  },
  health: {
    label: "Saúde",
    color: "var(--chart-4)",
  },
  other: {
    label: "Outros",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

export function ChartPieSimple() {
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
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie data={chartData} dataKey="visitors" nameKey="browser" />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
