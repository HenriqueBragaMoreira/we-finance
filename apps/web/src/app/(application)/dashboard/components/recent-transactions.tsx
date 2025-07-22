import { PiggyBank, TrendingDown, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function RecentTransactions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transações Recentes</CardTitle>
        <CardDescription>Últimas movimentações financeiras</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[
            {
              tipo: "receita",
              descricao: "Salário Henrique",
              valor: 4500,
              data: "01/03/2024",
              pessoa: "Henrique",
              status: "Recebido",
            },
            {
              tipo: "despesa",
              descricao: "Supermercado",
              valor: 350,
              data: "02/03/2024",
              pessoa: "Gislaine",
              status: "Pago",
            },
            {
              tipo: "receita",
              descricao: "Freelance",
              valor: 800,
              data: "03/03/2024",
              pessoa: "Henrique",
              status: "Pendente",
            },
            {
              tipo: "despesa",
              descricao: "Conta de Luz",
              valor: 180,
              data: "05/03/2024",
              pessoa: "Henrique",
              status: "Pendente",
            },
            {
              tipo: "investimento",
              descricao: "Tesouro Direto",
              valor: 500,
              data: "10/03/2024",
              pessoa: "Henrique",
              status: "Aplicado",
            },
          ].map((transacao, index) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: <>
              key={index}
              className="flex flex-col gap-3 sm:flex-row items-center sm:justify-between py-2 sm:p-3 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-1.5 sm:p-2 rounded-full ${
                    transacao.tipo === "receita"
                      ? "bg-green-100"
                      : transacao.tipo === "despesa"
                        ? "bg-red-100"
                        : "bg-purple-100"
                  }`}
                >
                  {transacao.tipo === "receita" ? (
                    <TrendingUp
                      className={`size-3.5 sm:size-4 ${transacao.tipo === "receita" ? "text-green-600" : ""}`}
                    />
                  ) : transacao.tipo === "despesa" ? (
                    <TrendingDown className="size-3.5 sm:size-4 text-red-600" />
                  ) : (
                    <PiggyBank className="size-3.5 sm:size-4 text-purple-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm sm:text-base font-medium">
                    {transacao.descricao}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {transacao.pessoa} • {transacao.data}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 items-center text-right">
                <p
                  className={`font-semibold ${
                    transacao.tipo === "receita"
                      ? "text-green-600"
                      : transacao.tipo === "despesa"
                        ? "text-red-600"
                        : "text-purple-600"
                  }`}
                >
                  {transacao.tipo === "receita" ? "+" : "-"}R${" "}
                  {transacao.valor.toLocaleString("pt-BR")}
                </p>

                <Badge className="gap-1.5" variant="outline">
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
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
