import { api } from "@/lib/ky";
import { queryParamsBuilder } from "@/utils/query-params-builder";
import type {
  GetExpenseMonthlyStatsResponse,
  GetExpenseProps,
  GetExpenseResponse,
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
};
