import { TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTableContainer } from "./components/data-table-container";

export default function ExpensesPage() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 *:data-[slot=card]:gap-2 **:data-[slot=card-header]:pb-0">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Despesas
            </CardTitle>
            <TrendingDown className="size-6 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">R$ 4.130</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagas</CardTitle>
            <TrendingDown className="size-6 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">R$ 3.950</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <TrendingDown className="size-6 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">R$ 180</div>
          </CardContent>
        </Card>
      </div>

      <DataTableContainer />
    </>
  );
}
