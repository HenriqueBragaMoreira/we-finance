import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { GetCategoriesResponseDataField } from "@/services/categories/types";
import { CategoriesActionForm } from "./forms/categories-action-form";

type CategoriesActionDialogProps = {
  children: React.JSX.Element;
  category?: GetCategoriesResponseDataField;
};

export function CategoriesActionDialog({
  children,
  category,
}: CategoriesActionDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {category ? "Editar Categoria" : "Adicionar Categoria"}
          </DialogTitle>
          <DialogDescription>
            {category
              ? "Insira os detalhes da categoria a ser editada."
              : "Insira os detalhes da categoria a ser adicionada."}
          </DialogDescription>
        </DialogHeader>

        <CategoriesActionForm category={category} />
      </DialogContent>
    </Dialog>
  );
}
