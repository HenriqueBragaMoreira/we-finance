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
import { paymentMethodsServices } from "@/services/payment-methods";
import type { GetPaymentMethodsResponse } from "@/services/payment-methods/types";
import { useMutation } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export function DeletePaymentMethodDialog({
  paymentMethodId,
}: {
  paymentMethodId: string;
}) {
  const queryClient = getQueryClient();

  const { mutate } = useMutation({
    mutationKey: ["delete-payment-method"],
    mutationFn: () => paymentMethodsServices.delete(paymentMethodId),
    onError: () => {
      toast.error("Erro ao excluir método de pagamento");
    },
    onSuccess: (data) => {
      toast.success("Método de pagamento excluído com sucesso!");

      queryClient.setQueriesData(
        { queryKey: ["get-payment-methods"], exact: false },
        (oldData: GetPaymentMethodsResponse | undefined) => {
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
          <DialogTitle>Excluir Método de Pagamento</DialogTitle>
          <DialogDescription>
            Tem certeza de que deseja excluir este método de pagamento? Esta
            ação não pode ser desfeita.
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
