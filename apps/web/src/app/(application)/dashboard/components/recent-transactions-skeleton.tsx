import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function RecentTransactionsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transações Recentes</CardTitle>
        <CardDescription>Últimas movimentações financeiras</CardDescription>
      </CardHeader>
      <CardContent className="max-h-96 overflow-y-auto no-scrollbar">
        <div className="space-y-4">
          {Array.from({ length: 5 }, (_, index) => `transaction-${index}`).map(
            (transactionId) => (
              <div
                key={transactionId}
                className="flex flex-col gap-3 sm:flex-row items-center sm:justify-between py-2 sm:p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 sm:p-2 rounded-full bg-gray-100">
                    <Skeleton className="size-3.5 sm:size-4" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Skeleton className="h-4 w-32 sm:w-40 mb-1" />
                    <Skeleton className="h-3 w-24 sm:w-28" />
                  </div>
                </div>

                <div className="flex gap-2 items-center text-right">
                  <Skeleton className="h-5 w-20 sm:w-24" />
                </div>
              </div>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
}
