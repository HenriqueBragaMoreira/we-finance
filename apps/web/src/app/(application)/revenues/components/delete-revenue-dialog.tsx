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
import { incomesServices } from "@/services/incomes";
import type { GetIncomesResponse } from "@/services/incomes/types";

export function DeleteRevenueDialog({ incomeId }: { incomeId: string }) {
  const queryClient = getQueryClient();

  const { mutate } = useMutation({
    mutationKey: ["delete-income"],
    mutationFn: () => incomesServices.delete(incomeId),
    onError: () => {
      toast.error("Erro ao excluir receita");
    },
    onSuccess: (data) => {
      toast.success("Receita excluída com sucesso!");

      queryClient.setQueriesData(
        { queryKey: ["get-incomes"], exact: false },
        (oldData: GetIncomesResponse | undefined) => {
          if (!oldData) return oldData;

          const updatedData = oldData.data.filter(
            (item) => item.id !== data.id
          );

          return {
            ...oldData,
            data: updatedData,
          };
        }
      );

      queryClient.invalidateQueries({ queryKey: ["income-monthly-stats"] });

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
          <DialogTitle>Excluir Receita</DialogTitle>
          <DialogDescription>
            Tem certeza de que deseja excluir esta receita? Esta ação não pode
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
