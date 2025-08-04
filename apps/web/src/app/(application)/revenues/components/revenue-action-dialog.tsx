import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { GetIncomesResponseDataField } from "@/services/incomes/types";
import { RevenueActionForm } from "./forms/revenue-action-form";

type RevenueActionDialogProps = {
  children: React.JSX.Element;
  income?: GetIncomesResponseDataField;
};

export function RevenueActionDialog({
  children,
  income,
}: RevenueActionDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {income ? "Editar Receita" : "Adicionar Receita"}
          </DialogTitle>
          <DialogDescription>
            {income
              ? "Insira os detalhes da receita a ser editada."
              : "Insira os detalhes da receita a ser adicionada."}
          </DialogDescription>
        </DialogHeader>

        <RevenueActionForm
          data={
            income
              ? {
                  ...income,
                  amount: Number(income.amount).toFixed(2),
                  receivedAt: income.receivedAt ?? "",
                }
              : undefined
          }
        />
      </DialogContent>
    </Dialog>
  );
}
