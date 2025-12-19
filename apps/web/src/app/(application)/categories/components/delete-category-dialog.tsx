import { useMutation } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  handleCloseDialog,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { getQueryClient } from "@/lib/tanstack-query";
import { categoriesServices } from "@/services/categories";
import type { GetCategoriesResponse } from "@/services/categories/types";

export function DeleteCategoryDialog({ categoryId }: { categoryId: string }) {
  const queryClient = getQueryClient();

  const { mutate } = useMutation({
    mutationKey: ["delete-category"],
    mutationFn: () => categoriesServices.delete(categoryId),
    onError: () => {
      toast.error("Erro ao excluir categoria");
    },
    onSuccess: (data) => {
      toast.success("Categoria excluída com sucesso!");

      queryClient.setQueriesData(
        { queryKey: ["get-categories"], exact: false },
        (oldData: GetCategoriesResponse | undefined) => {
          if (!oldData) return oldData;

          const updatedData = oldData.data.filter(
            (item) => item.id !== data.id
          );

          let activeCount = oldData.activeCount;
          let inactiveCount = oldData.inactiveCount;

          if (data.isActive === true) {
            activeCount--;
          } else {
            inactiveCount--;
          }

          return {
            ...oldData,
            data: updatedData,
            totalLength: oldData.totalLength - 1,
            activeCount,
            inactiveCount,
          };
        }
      );

      handleCloseDialog();
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Trash2
            size={16}
            className="text-destructive opacity-60"
            aria-hidden="true"
          />
          Excluir
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir Categoria</DialogTitle>
          <DialogDescription>
            Tem certeza de que deseja excluir esta categoria? Esta ação não pode
            ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancelar</Button>
          </DialogClose>
          <Button onClick={() => mutate()} variant="destructive">
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
