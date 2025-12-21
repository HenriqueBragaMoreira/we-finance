import { api } from "@/lib/ky";
import { masks } from "@/utils/masks";
import { queryParamsBuilder } from "@/utils/query-params-builder";
import type {
  CreateExpenseProps,
  CreateExpenseResponse,
  DeleteExpenseResponse,
  GetExpenseMonthlyStatsResponse,
  GetExpenseProps,
  GetExpenseResponse,
  UpdateExpenseProps,
  UpdateExpenseResponse,
  UpdateInstallmentProps,
  UpdateInstallmentResponse,
} from "./types";

export const expenseServices = {
  get: async (data: GetExpenseProps): Promise<GetExpenseResponse> => {
    const { params: searchParams } = queryParamsBuilder([
      { param: "description", value: data?.description },
      { param: "expenseType", value: data?.expenseType },
      { param: "category", value: data?.category },
      { param: "amount", value: data?.amount },
      { param: "paymentMethod", value: data?.paymentMethod },
      { param: "status", value: data?.status },
      {
        param: "date",
        value:
          data?.date &&
          new Date(Number(data?.date)).toISOString().split("T")[0],
      },
      { param: "userId", value: data?.person },
      { param: "init", value: data?.page },
      { param: "limit", value: data?.rowsPerPage },
    ]);

    const response = await api.get("expenses", { searchParams });

    return response.json();
  },
  getMonthlyStats: async (): Promise<GetExpenseMonthlyStatsResponse> => {
    const response = await api.get("expenses/monthly-stats");

    return response.json();
  },
  async create(data: CreateExpenseProps): Promise<CreateExpenseResponse> {
    const response = await api.post("expenses", {
      json: {
        ...data,
        amount: masks.removeMask(data.amount),
      },
    });

    return response.json();
  },
  async update(data: UpdateExpenseProps): Promise<UpdateExpenseResponse> {
    const response = await api.patch(`expenses/${data.id}`, {
      json: {
        ...data,
        installmentsCount: Number(data.installmentsCount),
        amount: masks.removeMask(data.amount),
      },
    });

    return response.json();
  },
  async delete(id: string): Promise<DeleteExpenseResponse> {
    const response = await api.delete(`expenses/${id}`);

    return response.json();
  },
  async updateInstallment(
    id: string,
    data: UpdateInstallmentProps
  ): Promise<UpdateInstallmentResponse> {
    const response = await api.patch(`expenses/installments/${id}`, {
      json: data,
    });

    return response.json();
  },
};
