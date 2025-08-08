import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ChartPieSimpleSkeleton() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Despesas por Categoria</CardTitle>
        <CardDescription>Distribuição dos gastos do mês</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="mx-auto aspect-square max-h-[400px] flex items-center justify-center">
          <div className="relative">
            <Skeleton className="size-80 rounded-full" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Skeleton className="size-60 rounded-full bg-background" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
