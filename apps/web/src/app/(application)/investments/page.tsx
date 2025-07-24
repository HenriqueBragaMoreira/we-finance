import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PiggyBank, TrendingUp } from "lucide-react";
import { DataTable } from "./components/data-table";
import { InvestmentsHeader } from "./components/investments-header";
// import { DataTable } from "./components/data-table";

export default function InvestmentsPage() {
  return (
    <>
      <InvestmentsHeader />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 *:data-[slot=card]:gap-2 **:data-[slot=card-header]:pb-0">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Investido
            </CardTitle>
            <PiggyBank className="size-6 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">R$ 2.600</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Henrique</CardTitle>
            <TrendingUp className="size-6 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">R$ 1.800</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gislaine</CardTitle>
            <TrendingUp className="size-6 text-pink-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-600">R$ 800</div>
          </CardContent>
        </Card>
      </div>

      <DataTable />
    </>
  );
}
