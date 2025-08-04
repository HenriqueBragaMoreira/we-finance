import { api } from "@/lib/ky";
import { masks } from "@/utils/masks";
import { queryParamsBuilder } from "@/utils/query-params-builder";
import type {
  CreateIncomeProps,
  CreateIncomeResponse,
  DeleteIncomeResponse,
  GetIncomesByIdResponse,
  GetIncomesProps,
  GetIncomesResponse,
  GetMonthlyStatsResponse,
  UpdateIncomeProps,
  UpdateIncomeResponse,
} from "./types";

export const incomesServices = {
  async get(data?: GetIncomesProps): Promise<GetIncomesResponse> {
    const { params: searchParams } = queryParamsBuilder([
      { param: "description", value: data?.description },
      { param: "incomeType", value: data?.incomeType },
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

    const response = await api.get("incomes", { searchParams });

    return response.json();
  },
  async getById(id: string): Promise<GetIncomesByIdResponse> {
    const response = await api.get(`incomes/${id}`);

    return response.json();
  },
  async getMonthlyStats(): Promise<GetMonthlyStatsResponse> {
    const response = await api.get("incomes/monthly-stats");

    return response.json();
  },
  async create(data: CreateIncomeProps): Promise<CreateIncomeResponse> {
    const response = await api.post("incomes", {
      json: {
        ...data,
        amount: masks.removeMask(data.amount),
      },
    });

    return response.json();
  },
  async update(data: UpdateIncomeProps): Promise<UpdateIncomeResponse> {
    const response = await api.patch(`incomes/${data.id}`, {
      json: {
        ...data,
        amount: masks.removeMask(data.amount),
      },
    });

    return response.json();
  },
  async delete(id: string): Promise<DeleteIncomeResponse> {
    const response = await api.delete(`incomes/${id}`);

    return response.json();
  },
};
