"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { GetCategoriesResponse } from "@/services/categories/types";
import { Tag } from "lucide-react";
import { CategoriesHeaderCardsSkeleton } from "./categories-header-cards-skeleton";

type CategoriesHeaderCardsProps = {
  data: GetCategoriesResponse | undefined;
  isFetching: boolean;
};

export function CategoriesHeaderCards({
  data,
  isFetching,
}: CategoriesHeaderCardsProps) {
  if (isFetching) {
    return <CategoriesHeaderCardsSkeleton />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 *:data-[slot=card]:gap-2 **:data-[slot=card-header]:pb-0">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Categorias
          </CardTitle>
          <Tag className="size-6 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {data?.totalLength}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ativas</CardTitle>
          <Tag className="size-6 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {data?.activeCount}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Inativas</CardTitle>
          <Tag className="size-6 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {data?.inactiveCount}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
