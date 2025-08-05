import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { GetExpenseResponseDataField } from "@/services/expense/types";
import { ExpensesActionForm } from "./forms/expenses-action-form";

type ExpensesActionDialogProps = {
  children: React.JSX.Element;
  expense?: GetExpenseResponseDataField;
};

export function ExpensesActionDialog({
  children,
  expense,
}: ExpensesActionDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {expense ? "Editar Despesa" : "Adicionar Despesa"}
          </DialogTitle>
          <DialogDescription>
            {expense
              ? "Insira os detalhes da despesa a ser editada."
              : "Insira os detalhes da despesa a ser adicionada."}
          </DialogDescription>
        </DialogHeader>

        <ExpensesActionForm data={expense} />
      </DialogContent>
    </Dialog>
  );
}
