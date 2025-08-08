"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
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
import { investmentServices } from "@/services/investment";
import type {
  GetInvestmentResponse,
  GetInvestmentResponseDataField,
} from "@/services/investment/types";
import { masks } from "@/utils/masks";

const investmentSchema = z.object({
  notes: z.string().min(1, "Descrição obrigatória"),
  category: z.string().min(1, "Categoria é obrigatória"),
  amount: z.string().min(1, "Valor deve ser positivo"),
  investedAt: z.date(),
});

export type InvestmentSchemaType = z.infer<typeof investmentSchema>;

type InvestmentActionFormProps = {
  data?: GetInvestmentResponseDataField;
};

export function InvestmentActionForm({ data }: InvestmentActionFormProps) {
  const queryClient = getQueryClient();

  const categories: GetCategoriesResponse | undefined =
    queryClient.getQueryData(["get-categories", "INVESTMENT"]);

  const form = useForm<InvestmentSchemaType>({
    resolver: zodResolver(investmentSchema),
    defaultValues: {
      notes: data?.notes ?? "",
      category: data?.category ?? "",
      amount: masks.money(data?.amount ?? "") ?? "",
      investedAt: data?.investedAt ? new Date(data.investedAt) : new Date(),
    },
  });

  const { mutate } = useMutation({
    mutationKey: ["create-investment"],
    mutationFn: async (mutationData: InvestmentSchemaType) => {
      if (data) {
        return await investmentServices.update({
          ...mutationData,
          id: data.id,
          investedAt: mutationData.investedAt.toISOString(),
        });
      } else {
        return await investmentServices.create({
          ...mutationData,
          investedAt: mutationData.investedAt.toISOString(),
        });
      }
    },
    onError: () => {
      toast.error(
        data ? "Erro ao editar investimento" : "Erro ao criar investimento"
      );
    },
    onSuccess: (newInvestment) => {
      toast.success(
        data
          ? "Investimento editado com sucesso!"
          : "Investimento criado com sucesso!"
      );

      queryClient.setQueriesData(
        { queryKey: ["get-investments"], exact: false },
        (oldData: GetInvestmentResponse | undefined) => {
          if (!oldData) return oldData;

          if (data) {
            const updatedData = [...oldData.data];
            const itemIndex = updatedData.findIndex(
              (item) => item.id === data.id
            );

            if (itemIndex !== -1) {
              updatedData[itemIndex] = newInvestment;
            }

            return {
              ...oldData,
              data: updatedData,
            };
          } else {
            return {
              ...oldData,
              data: [newInvestment, ...oldData.data],
              totalLength: oldData.totalLength + 1,
            };
          }
        }
      );

      queryClient.invalidateQueries({
        queryKey: ["investment-monthly-stats"],
      });

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
          name="notes"
          render={({ field }) => (
            <FormItem className="col-span-1 sm:col-span-2">
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input
                  placeholder="Adicione uma descrição do investimento"
                  {...field}
                />
              </FormControl>

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
                  placeholder="Adicione o valor do investimento"
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
          name="investedAt"
          render={({ field }) => (
            <FormItem className="col-span-2 flex flex-col">
              <FormLabel>Data do Investimento</FormLabel>
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
            {data ? "Salvar" : "Adicionar"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
