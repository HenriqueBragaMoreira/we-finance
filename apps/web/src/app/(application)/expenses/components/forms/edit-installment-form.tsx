import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  DialogClose,
  DialogFooter,
  handleCloseDialog,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getQueryClient } from "@/lib/tanstack-query";
import { cn } from "@/lib/utils";
import { expenseServices } from "@/services/expense";
import type {
  GetExpenseResponse,
  GetExpenseResponseInstallmentField,
} from "@/services/expense/types";

const editInstallmentSchema = z.object({
  dueDate: z.date().optional(),
  status: z.enum(["PAID", "PENDING"]).optional(),
});

type EditInstallmentSchemaType = z.infer<typeof editInstallmentSchema>;

type EditInstallmentFormProps = {
  data: GetExpenseResponseInstallmentField;
};

export function EditInstallmentForm({ data }: EditInstallmentFormProps) {
  const queryClient = getQueryClient();

  const form = useForm<EditInstallmentSchemaType>({
    resolver: zodResolver(editInstallmentSchema),
    defaultValues: {
      dueDate: new Date(data.dueDate),
      status: data.status as "PAID" | "PENDING",
    },
  });

  const { mutate } = useMutation({
    mutationKey: ["update-installment"],
    mutationFn: async (formData: EditInstallmentSchemaType) => {
      return await expenseServices.updateInstallment(data.id, formData);
    },
    onError: () => {
      toast.error("Erro ao atualizar parcela");
    },
    onSuccess: (updatedInstallment) => {
      toast.success("Parcela atualizada com sucesso");

      queryClient.setQueriesData(
        { queryKey: ["get-expense"], exact: false },
        (oldData: GetExpenseResponse | undefined) => {
          if (!oldData) return oldData;

          const updatedData = oldData.data.map((item) =>
            item.installments.find((installment) => installment.id === data.id)
              ? {
                  ...item,
                  installments: item.installments.map((installment) =>
                    installment.id === data.id
                      ? { ...installment, ...updatedInstallment }
                      : installment
                  ),
                }
              : item
          );

          return {
            ...oldData,
            data: updatedData,
          };
        }
      );

      handleCloseDialog();
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => mutate(data))}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="PAID">
                    <span
                      className="size-1.5 rounded-full bg-emerald-500"
                      aria-hidden="true"
                    />
                    Pago
                  </SelectItem>
                  <SelectItem value="PENDING">
                    <span
                      className="size-1.5 rounded-full bg-amber-500"
                      aria-hidden="true"
                    />
                    Pendente
                  </SelectItem>
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem className="flex flex-col col-span-2">
              <FormLabel>Data de vencimento</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP", { locale: ptBR })
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>

              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter className="mt-2 col-span-1 sm:col-span-2">
          <DialogClose asChild>
            <Button
              disabled={form.formState.isSubmitting}
              type="button"
              variant="outline"
            >
              Cancelar
            </Button>
          </DialogClose>

          <Button disabled={form.formState.isSubmitting} type="submit">
            Salvar
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
