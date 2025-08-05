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
import { expenseServices } from "@/services/expense";
import type { GetExpenseResponse } from "@/services/expense/types";
import { useMutation } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export function DeleteExpenseDialog({ expenseId }: { expenseId: string }) {
  const queryClient = getQueryClient();

  const { mutate } = useMutation({
    mutationKey: ["delete-expense"],
    mutationFn: () => expenseServices.delete(expenseId),
    onError: () => {
      toast.error("Erro ao excluir despesa");
    },
    onSuccess: (data) => {
      toast.success("Despesa excluída com sucesso!");

      queryClient.setQueriesData(
        { queryKey: ["get-expense"], exact: false },
        (oldData: GetExpenseResponse | undefined) => {
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

      queryClient.invalidateQueries({ queryKey: ["expense-monthly-stats"] });

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
          <DialogTitle>Excluir Despesa</DialogTitle>
          <DialogDescription>
            Tem certeza de que deseja excluir esta despesa? Esta ação não pode
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
