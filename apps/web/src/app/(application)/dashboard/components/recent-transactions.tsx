"use client";
import { useQuery } from "@tanstack/react-query";
import { PiggyBank, TrendingDown, TrendingUp } from "lucide-react";
import { parseAsString, useQueryStates } from "nuqs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { dashboardServices } from "@/services/dashboard";
import { RecentTransactionsSkeleton } from "./recent-transactions-skeleton";

export function RecentTransactions() {
  const [filters] = useQueryStates({
    person: parseAsString.withDefault(""),
    month: parseAsString.withDefault(""),
    year: parseAsString.withDefault(""),
  });

  const { data, isFetching } = useQuery({
    queryKey: ["get-last-transactions", filters],
    queryFn: async () => {
      return await dashboardServices.getLastTransactions(filters);
    },
  });

  if (isFetching) {
    return <RecentTransactionsSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transações Recentes</CardTitle>
        <CardDescription>Últimas movimentações financeiras</CardDescription>
      </CardHeader>
      <CardContent className="max-h-96 overflow-y-auto no-scrollbar">
        <div className="space-y-4">
          {data?.data.map((transaction) => (
            <div
              key={transaction.id}
              className="flex flex-col gap-3 sm:flex-row items-center sm:justify-between py-2 sm:p-3 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-1.5 sm:p-2 rounded-full ${
                    transaction.type === "INCOME"
                      ? "bg-green-100"
                      : transaction.type === "EXPENSE"
                        ? "bg-red-100"
                        : "bg-purple-100"
                  }`}
                >
                  {transaction.type === "INCOME" ? (
                    <TrendingUp
                      className={`size-3.5 sm:size-4 ${transaction.type === "INCOME" ? "text-green-600" : ""}`}
                    />
                  ) : transaction.type === "EXPENSE" ? (
                    <TrendingDown className="size-3.5 sm:size-4 text-red-600" />
                  ) : (
                    <PiggyBank className="size-3.5 sm:size-4 text-purple-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm sm:text-base font-medium">
                    {transaction.name}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {transaction.user} •{" "}
                    {new Date(transaction.date).toLocaleDateString("pt-BR", {
                      timeZone: "UTC",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 items-center text-right">
                <p
                  className={`font-semibold ${
                    transaction.type === "INCOME"
                      ? "text-green-600"
                      : transaction.type === "EXPENSE"
                        ? "text-red-600"
                        : "text-purple-600"
                  }`}
                >
                  {transaction.type === "INCOME" ? "+" : "-"}R${" "}
                  {transaction.amount.toLocaleString("pt-BR")}
                </p>

                {/* <Badge className="gap-1.5" variant="outline">
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      transacao.status === "Recebido" && "bg-emerald-500",
                      transacao.status === "Pendente" && "bg-amber-500",
                      transacao.status === "Pago" && "bg-red-500",
                      transacao.status === "Aplicado" && "bg-purple-500"
                    )}
                    aria-hidden="true"
                  />
                  {transacao.status}
                </Badge> */}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
