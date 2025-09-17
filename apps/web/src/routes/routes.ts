import {
  Bookmark,
  ChartCandlestick,
  CreditCard,
  type LucideProps,
  PiggyBank,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

export type RoutesType = {
  title: string;
  path: string;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref">>;
  type: "general" | "settings";
};

export const routes: RoutesType[] = [
  {
    path: "/dashboard",
    title: "Dashboard",
    icon: ChartCandlestick,
    type: "general",
  },
  {
    path: "/revenues",
    title: "Receitas",
    icon: TrendingUp,
    type: "general",
  },
  {
    path: "/expenses",
    title: "Despesas",
    icon: TrendingDown,
    type: "general",
  },
  {
    path: "/investments",
    title: "Investimentos",
    icon: PiggyBank,
    type: "general",
  },
  {
    path: "/categories",
    title: "Categorias",
    icon: Bookmark,
    type: "settings",
  },
  {
    path: "/payment-methods",
    title: "Métodos de pagamento",
    icon: CreditCard,
    type: "settings",
  },
];
