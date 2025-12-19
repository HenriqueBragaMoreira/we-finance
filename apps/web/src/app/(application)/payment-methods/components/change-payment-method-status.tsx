import { useMutation } from "@tanstack/react-query";
import { CircleCheck, CirclePause } from "lucide-react";
import { toast } from "sonner";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { getQueryClient } from "@/lib/tanstack-query";
import { paymentMethodsServices } from "@/services/payment-methods";
import type { GetPaymentMethodsResponse } from "@/services/payment-methods/types";

type ChangePaymentMethodStatusProps = {
  paymentMethodId: string;
  isActive: boolean;
};

export function ChangePaymentMethodStatus({
  paymentMethodId,
  isActive,
}: ChangePaymentMethodStatusProps) {
  const queryClient = getQueryClient();

  const { mutate } = useMutation({
    mutationKey: ["change-payment-method-status"],
    mutationFn: () =>
      paymentMethodsServices.update({ isActive: !isActive }, paymentMethodId),
    onError: () => {
      toast.error(
        !isActive
          ? "Erro ao ativar método de pagamento"
          : "Erro ao inativar método de pagamento"
      );
    },
    onSuccess: (data) => {
      toast.success(
        !isActive
          ? "Método de pagamento ativado com sucesso!"
          : "Método de pagamento inativado com sucesso!"
      );

      queryClient.setQueriesData(
        { queryKey: ["get-payment-methods"], exact: false },
        (oldData: GetPaymentMethodsResponse | undefined) => {
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
