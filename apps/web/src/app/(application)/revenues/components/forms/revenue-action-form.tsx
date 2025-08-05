"use client";

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
import { Input } from "@/components/ui/input";
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
import type { GetCategoriesResponse } from "@/services/categories/types";
import { incomesServices } from "@/services/incomes";
import type {
  GetIncomesResponse,
  GetIncomesResponseDataField,
} from "@/services/incomes/types";
import type { GetPaymentMethodsResponse } from "@/services/payment-methods/types";
import { masks } from "@/utils/masks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const revenueSchema = z.object({
  name: z.string().min(1, "Descrição obrigatória"),
  incomeType: z.enum(["FIXED", "VARIABLE"], {
    message: "Selecione um tipo de receita",
  }),
  category: z.string().min(1, "Categoria é obrigatória"),
  amount: z.string().min(1, "Valor deve ser positivo"),
  paymentMethod: z.string().min(1, "Selecione um método"),
  status: z.enum(["RECEIVED", "PENDING"]),
  receivedAt: z.date(),
});

export type RevenueSchemaType = z.infer<typeof revenueSchema>;

type RevenueActionFormProps = {
  data?: GetIncomesResponseDataField;
};

export function RevenueActionForm({ data }: RevenueActionFormProps) {
  const queryClient = getQueryClient();

  const categories: GetCategoriesResponse | undefined =
    queryClient.getQueryData(["get-categories", "INCOME"]);

  const paymentMethods: GetPaymentMethodsResponse | undefined =
    queryClient.getQueryData(["get-payment-methods"]);

  const form = useForm<RevenueSchemaType>({
    resolver: zodResolver(revenueSchema),
    defaultValues: {
      name: data?.name ?? "",
      incomeType: data?.incomeType ?? "FIXED",
      category: data?.category ?? "",
      amount: masks.money(data?.amount ?? "") ?? "",
      paymentMethod: data?.paymentMethod ?? "",
      status: data?.status ?? "PENDING",
      receivedAt: data?.receivedAt ? new Date(data.receivedAt) : new Date(),
    },
  });

  const { mutate } = useMutation({
    mutationKey: ["create-income"],
    mutationFn: async (mutationData: RevenueSchemaType) => {
      if (data) {
        return await incomesServices.update({
          ...mutationData,
          id: data.id,
        });
      } else {
        return await incomesServices.create({
          ...mutationData,
        });
      }
    },
    onError: () => {
      toast.error(data ? "Erro ao editar receita" : "Erro ao criar receita");
    },
    onSuccess: (newIncome) => {
      toast.success(
        data ? "Receita editada com sucesso!" : "Receita criada com sucesso!"
      );

      queryClient.setQueriesData(
        { queryKey: ["get-incomes"], exact: false },
        (oldData: GetIncomesResponse | undefined) => {
          if (!oldData) return oldData;

          if (data) {
            const updatedData = [...oldData.data];
            const itemIndex = updatedData.findIndex(
              (item) => item.id === data.id
            );

            if (itemIndex !== -1) {
              updatedData[itemIndex] = newIncome;
            }

            return {
              ...oldData,
              data: updatedData,
            };
          } else {
            return {
              ...oldData,
              data: [newIncome, ...oldData.data],
              totalLength: oldData.totalLength + 1,
            };
          }
        }
      );

      queryClient.invalidateQueries({ queryKey: ["income-monthly-stats"] });

      handleCloseDialog();
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => mutate(data))}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        autoComplete="off"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="col-span-1 sm:col-span-2">
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input placeholder="Adicione uma descrição" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="incomeType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Receita</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o tipo de receita" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="FIXED">
                    <span
                      className="size-1.5 rounded-full bg-blue-300"
                      aria-hidden="true"
                    />
                    Fixa
                  </SelectItem>
                  <SelectItem value="VARIABLE">
                    <span
                      className="size-1.5 rounded-full bg-yellow-300"
                      aria-hidden="true"
                    />
                    Variável
                  </SelectItem>
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor</FormLabel>
              <FormControl>
                <Input
                  placeholder="Adicione o valor da receita"
                  {...field}
                  onChange={(e) => {
                    field.onChange(masks.money(e.target.value));
                  }}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories?.data?.map((category) => (
                    <SelectItem key={category.name} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="paymentMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Método de Pagamento</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um método" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {paymentMethods?.data?.map((method) => (
                    <SelectItem key={method.name} value={method.name}>
                      {method.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

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
                  <SelectItem value="RECEIVED">
                    <span
                      className="size-1.5 rounded-full bg-emerald-500"
                      aria-hidden="true"
                    />
                    Recebido
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
          name="receivedAt"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data de Recebimento</FormLabel>
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

          <Button
            disabled={form.formState.isSubmitting}
            type="submit"
            variant="success"
          >
            Adicionar
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
