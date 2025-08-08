import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ChartBarMultipleSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Receitas vs Despesas</CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-32" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex aspect-video justify-center text-xs">
          <div className="w-full h-full flex flex-col">
            <div className="flex-1 flex items-end justify-around gap-2 px-4 py-8">
              {Array.from(
                { length: 7 },
                (_, index) => `bar-group-${index}`
              ).map((barGroupId, index) => {
                const revenueHeights = [45, 65, 35, 75, 55, 40, 60];
                const expenseHeights = [60, 40, 50, 45, 70, 55, 35];

                return (
                  <div key={barGroupId} className="flex gap-1 items-end">
                    <Skeleton
                      className="w-4 bg-green-200"
                      style={{
                        height: `${revenueHeights[index]}px`,
                      }}
                    />
                    <Skeleton
                      className="w-4 bg-red-200"
                      style={{
                        height: `${expenseHeights[index]}px`,
                      }}
                    />
                  </div>
                );
              })}
            </div>

            <div className="flex justify-around gap-2 px-4 pt-2">
              {Array.from({ length: 7 }, (_, index) => `label-${index}`).map(
                (labelId) => (
                  <Skeleton key={labelId} className="h-3 w-8" />
                )
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
