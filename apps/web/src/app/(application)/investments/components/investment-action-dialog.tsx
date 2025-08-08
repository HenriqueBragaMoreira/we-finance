import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { GetInvestmentResponseDataField } from "@/services/investment/types";
import { InvestmentActionForm } from "./forms/investment-action-form";

type InvestmentActionDialogProps = {
  children: React.JSX.Element;
  investment?: GetInvestmentResponseDataField;
};

export function InvestmentActionDialog({
  children,
  investment,
}: InvestmentActionDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {investment ? "Editar Investimento" : "Adicionar Investimento"}
          </DialogTitle>
          <DialogDescription>
            {investment
              ? "Insira os detalhes do investimento a ser editado."
              : "Insira os detalhes do investimento a ser adicionado."}
          </DialogDescription>
        </DialogHeader>

        <InvestmentActionForm
          data={
            investment
              ? {
                  ...investment,
                  amount: Number(investment.amount).toFixed(2),
                  investedAt: investment.investedAt ?? "",
                }
              : undefined
          }
        />
      </DialogContent>
    </Dialog>
  );
}
