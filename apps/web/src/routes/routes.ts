import {
  ChartCandlestick,
  type LucideProps,
  PiggyBank,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

export type RoutesType = {
  title: string;
  path: string;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref">>;
};

export const routes: RoutesType[] = [
  {
    path: "/dashboard",
    title: "Dashboard",
    icon: ChartCandlestick,
  },
  {
    path: "/revenues",
    title: "Receitas",
    icon: TrendingUp,
  },
  {
    path: "/expenses",
    title: "Despesas",
    icon: TrendingDown,
  },
  {
    path: "/investments",
    title: "Investimentos",
    icon: PiggyBank,
  },
];
