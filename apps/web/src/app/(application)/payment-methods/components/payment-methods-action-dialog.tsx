import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { GetPaymentMethodsResponseDataField } from "@/services/payment-methods/types";
import { PaymentMethodsActionForm } from "./forms/payment-methods-action-form";

type PaymentMethodsActionDialogProps = {
  children: React.JSX.Element;
  paymentMethod?: GetPaymentMethodsResponseDataField;
};

export function PaymentMethodsActionDialog({
  children,
  paymentMethod,
}: PaymentMethodsActionDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {paymentMethod
              ? "Editar Método de Pagamento"
              : "Adicionar Método de Pagamento"}
          </DialogTitle>
          <DialogDescription>
            {paymentMethod
              ? "Insira os detalhes do método de pagamento a ser editado."
              : "Insira os detalhes do método de pagamento a ser adicionado."}
          </DialogDescription>
        </DialogHeader>

        <PaymentMethodsActionForm paymentMethod={paymentMethod} />
      </DialogContent>
    </Dialog>
  );
}
