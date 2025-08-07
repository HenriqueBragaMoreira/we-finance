import { api } from "@/lib/ky";
import { queryParamsBuilder } from "@/utils/query-params-builder";
import type {
  GetInvestmentMonthlyStatsResponse,
  GetInvestmentResponse,
  GetInvestmentsProps,
} from "./types";

export const investmentServices = {
  get: async (params?: GetInvestmentsProps): Promise<GetInvestmentResponse> => {
    const { params: searchParams } = queryParamsBuilder([
      { param: "init", value: params?.page },
      { param: "limit", value: params?.rowsPerPage },
      { param: "categoryId", value: params?.categoryId },
      { param: "userId", value: params?.person },
      {
        param: "investedAt",
        value:
          params?.investedAt &&
          new Date(Number(params?.investedAt)).toISOString().split("T")[0],
      },
      { param: "notes", value: params?.notes },
      { param: "amount", value: params?.amount },
    ]);

    const response = api.get("investments", { searchParams });

    return response.json();
  },
  getMonthlyStats: async (): Promise<GetInvestmentMonthlyStatsResponse> => {
    const response = api.get("investments/monthly-stats");

    return response.json();
  },
};
