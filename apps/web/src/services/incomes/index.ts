import { api } from "@/lib/ky";
import { queryParamsBuilder } from "@/utils/query-params-builder";
import type {
  GetIncomesProps,
  GetIncomesResponse,
  GetMonthlyStatsResponse,
} from "./types";

export const incomesServices = {
  async get(data?: GetIncomesProps): Promise<GetIncomesResponse> {
    const { params: searchParams } = queryParamsBuilder([
      { param: "description", value: data?.description },
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
      { param: "person", value: data?.person },
      { param: "init", value: data?.page },
      { param: "limit", value: data?.rowsPerPage },
    ]);

    const response = await api.get("incomes", { searchParams });

    return response.json();
  },
  async getMonthlyStats(): Promise<GetMonthlyStatsResponse> {
    const response = await api.get("incomes/monthly-stats");

    return response.json();
  },
};
