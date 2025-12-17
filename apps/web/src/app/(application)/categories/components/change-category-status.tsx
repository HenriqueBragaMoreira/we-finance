import { useMutation } from "@tanstack/react-query";
import { CircleCheck, CirclePause } from "lucide-react";
import { toast } from "sonner";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { getQueryClient } from "@/lib/tanstack-query";
import { categoriesServices } from "@/services/categories";
import type { GetCategoriesResponse } from "@/services/categories/types";

type ChangeCategoryStatusProps = {
  categoryId: string;
  isActive: boolean;
};

export function ChangeCategoryStatus({
  categoryId,
  isActive,
}: ChangeCategoryStatusProps) {
  const queryClient = getQueryClient();

  const { mutate } = useMutation({
    mutationKey: ["change-category-status"],
    mutationFn: () =>
      categoriesServices.update({ isActive: !isActive }, categoryId),
    onError: () => {
      toast.error(
        !isActive ? "Erro ao ativar categoria" : "Erro ao inativar categoria"
      );
    },
    onSuccess: (data) => {
      toast.success(
        !isActive
          ? "Categoria ativada com sucesso!"
          : "Categoria inativada com sucesso!"
      );

      queryClient.setQueriesData(
        { queryKey: ["get-categories"], exact: false },
        (oldData: GetCategoriesResponse | undefined) => {
          if (!oldData) return oldData;

          const updatedData = oldData.data.map((item) =>
            item.id === data.id ? { ...item, isActive: data.isActive } : item
          );

          let activeCount = oldData.activeCount;
          let inactiveCount = oldData.inactiveCount;

          if (data.isActive === true) {
            activeCount++;
            inactiveCount--;
          } else {
            activeCount--;
            inactiveCount++;
          }

          return {
            ...oldData,
            data: updatedData,
            activeCount,
            inactiveCount,
          };
        }
      );
    },
  });

  return (
    <DropdownMenuItem onClick={() => mutate()}>
      {isActive ? (
        <>
          <CirclePause
            size={16}
            className="text-yellow-300 opacity-60"
            aria-hidden="true"
          />
          Inativar
        </>
      ) : (
        <>
          <CircleCheck
            size={16}
            className="text-emerald-500 opacity-60"
            aria-hidden="true"
          />
          Ativar
        </>
      )}
    </DropdownMenuItem>
  );
}
