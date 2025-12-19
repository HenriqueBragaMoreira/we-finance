import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Color from "color";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
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
import {
  ColorPicker,
  ColorPickerEyeDropper,
  ColorPickerFormat,
  ColorPickerHue,
  ColorPickerSelection,
} from "@/components/ui/kibo-ui/color-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categoriesServices } from "@/services/categories";
import type {
  GetCategoriesResponse,
  GetCategoriesResponseDataField,
} from "@/services/categories/types";

const categoriesSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  type: z.enum(["INCOME", "EXPENSE", "INVESTMENT"], {
    message: "Selecione um tipo de categoria",
  }),
  color: z.string().min(1, "Cor é obrigatória"),
});

type CategoriesSchemaType = z.infer<typeof categoriesSchema>;

type CategoriesActionFormProps = {
  category?: GetCategoriesResponseDataField;
};

export function CategoriesActionForm({ category }: CategoriesActionFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<CategoriesSchemaType>({
    resolver: zodResolver(categoriesSchema),
    defaultValues: {
      name: category?.name ?? "",
      type: category?.type ?? "INCOME",
      color: category?.color ?? "#FFFFFF",
    },
  });

  const { mutate } = useMutation({
    mutationKey: ["create-category"],
    mutationFn: async (data: CategoriesSchemaType) => {
      if (category) {
        return await categoriesServices.update(data, category.id);
      } else {
        return await categoriesServices.create(data);
      }
    },
    onError: () => {
      toast.error("Erro ao criar categoria");
    },
    onSuccess: (newCategory) => {
      queryClient.setQueriesData(
        { queryKey: ["get-categories"], exact: false },
        (oldData: GetCategoriesResponse | undefined) => {
          if (!oldData) return oldData;

          if (category) {
            const updatedData = [...oldData.data];
            const itemIndex = updatedData.findIndex(
              (item) => item.id === category.id
            );

            if (itemIndex !== -1) {
              updatedData[itemIndex] = newCategory;
            }

            return {
              ...oldData,
              data: updatedData,
            };
          } else {
            return {
              ...oldData,
              data: [newCategory, ...oldData.data],
              totalLength: oldData.totalLength + 1,
              activeCount: oldData.activeCount + 1,
            };
          }
        }
      );

      toast.success(
        category
          ? "Categoria atualizada com sucesso"
          : "Categoria criada com sucesso"
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
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="INCOME">Receita</SelectItem>
                  <SelectItem value="EXPENSE">Despesa</SelectItem>
                  <SelectItem value="INVESTMENT">Investimento</SelectItem>
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem className="flex flex-col h-96">
              <FormLabel className="max-h-max">Cor</FormLabel>
              <FormControl>
                <ColorPicker
                  value={field.value}
                  onChange={(rgba) => {
                    const rgbaArray = rgba as [number, number, number, number];
                    const color = Color.rgb(
                      rgbaArray[0],
                      rgbaArray[1],
                      rgbaArray[2]
                    ).alpha(rgbaArray[3]);
                    field.onChange(color.hex());
                  }}
                  className="rounded-md border bg-background p-4 shadow-sm"
                >
                  <ColorPickerSelection />
                  <div className="flex items-center gap-4">
                    <ColorPickerEyeDropper />
                    <div className="grid w-full gap-1">
                      <ColorPickerHue />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ColorPickerFormat percentage={false} />
                  </div>
                </ColorPicker>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="submit">{category ? "Salvar" : "Adicionar"}</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
