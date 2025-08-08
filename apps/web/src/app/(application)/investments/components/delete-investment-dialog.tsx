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
import { investmentServices } from "@/services/investment";
import type { GetInvestmentResponse } from "@/services/investment/types";
import { useMutation } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export function DeleteInvestmentDialog({
  investmentId,
}: {
  investmentId: string;
}) {
  const queryClient = getQueryClient();

  const { mutate } = useMutation({
    mutationKey: ["delete-investment"],
    mutationFn: () => investmentServices.delete(investmentId),
    onError: () => {
      toast.error("Erro ao excluir investimento");
    },
    onSuccess: (data) => {
      toast.success("Investimento excluído com sucesso!");

      queryClient.setQueriesData(
        { queryKey: ["get-investments"], exact: false },
        (oldData: GetInvestmentResponse | undefined) => {
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

      queryClient.invalidateQueries({
        queryKey: ["investment-monthly-stats"],
      });

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
          <DialogTitle>Excluir Investimento</DialogTitle>
          <DialogDescription>
            Tem certeza de que deseja excluir este investimento? Esta ação não
            pode ser desfeita.
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
