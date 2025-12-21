import { SquarePen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import type { GetExpenseResponseInstallmentField } from "@/services/expense/types";
import { EditInstallmentForm } from "./forms/edit-installment-form";

type EditInstallmentDialogProps = {
  data: GetExpenseResponseInstallmentField;
};

export function EditInstallmentDialog({ data }: EditInstallmentDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <SquarePen size={16} className="opacity-60" aria-hidden="true" />
          Editar
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Parcela</DialogTitle>
          <DialogDescription>Edite os detalhes da parcela.</DialogDescription>
        </DialogHeader>

        <EditInstallmentForm data={data} />
      </DialogContent>
    </Dialog>
  );
}
