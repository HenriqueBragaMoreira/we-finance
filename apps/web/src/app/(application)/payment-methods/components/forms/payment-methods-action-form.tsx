import { Button } from "@/components/ui/button";
import { DialogFooter, handleCloseDialog } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { paymentMethodsServices } from "@/services/payment-methods";
import type {
  GetPaymentMethodsResponse,
  GetPaymentMethodsResponseDataField,
} from "@/services/payment-methods/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const paymentMethodsSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
});

type PaymentMethodsSchemaType = z.infer<typeof paymentMethodsSchema>;

type PaymentMethodsActionFormProps = {
  paymentMethod?: GetPaymentMethodsResponseDataField;
};

export function PaymentMethodsActionForm({
  paymentMethod,
}: PaymentMethodsActionFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<PaymentMethodsSchemaType>({
    resolver: zodResolver(paymentMethodsSchema),
    defaultValues: {
      name: paymentMethod?.name ?? "",
    },
  });

  const { mutate } = useMutation({
    mutationKey: ["create-payment-method"],
    mutationFn: async (data: PaymentMethodsSchemaType) => {
      if (paymentMethod) {
        return await paymentMethodsServices.update(data, paymentMethod.id);
      } else {
        return await paymentMethodsServices.create(data);
      }
    },
    onError: () => {
      toast.error("Erro ao criar método de pagamento");
    },
    onSuccess: (newPaymentMethod) => {
      queryClient.setQueriesData(
        { queryKey: ["get-payment-methods"], exact: false },
        (oldData: GetPaymentMethodsResponse | undefined) => {
          if (!oldData) return oldData;

          if (paymentMethod) {
            const updatedData = [...oldData.data];
            const itemIndex = updatedData.findIndex(
              (item) => item.id === paymentMethod.id
            );

            if (itemIndex !== -1) {
              updatedData[itemIndex] = newPaymentMethod;
            }

            return {
              ...oldData,
              data: updatedData,
            };
          } else {
            return {
              ...oldData,
              data: [newPaymentMethod, ...oldData.data],
              totalLength: oldData.totalLength + 1,
              activeCount: oldData.activeCount + 1,
            };
          }
        }
      );

      toast.success(
        paymentMethod
          ? "Método de pagamento atualizado com sucesso"
          : "Método de pagamento criado com sucesso"
      );

      handleCloseDialog();
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => mutate(data))}
        className="grid grid-cols-1 gap-4"
        autoComplete="off"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Adicione um nome" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="submit">
            {paymentMethod ? "Salvar" : "Adicionar"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
