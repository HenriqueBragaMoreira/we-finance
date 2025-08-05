import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ExpensesHeaderCardsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 *:data-[slot=card]:gap-2 **:data-[slot=card-header]:pb-0">
      {Array.from({ length: 3 }, (_, index) => `card-${index}`).map(
        (cardId) => (
          <Card key={cardId}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="size-6" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-44" />
            </CardContent>
          </Card>
        )
      )}
    </div>
  );
}
