import { api } from "@/lib/ky";
import { masks } from "@/utils/masks";
import { queryParamsBuilder } from "@/utils/query-params-builder";
import type {
  CreateInvestmentProps,
  CreateInvestmentResponse,
  DeleteInvestmentResponse,
  GetInvestmentMonthlyStatsResponse,
  GetInvestmentResponse,
  GetInvestmentsProps,
  UpdateInvestmentProps,
  UpdateInvestmentResponse,
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
  async create(data: CreateInvestmentProps): Promise<CreateInvestmentResponse> {
    const response = await api.post("investments", {
      json: {
        ...data,
        amount: masks.removeMask(data.amount),
      },
    });

    return response.json();
  },
  async update(data: UpdateInvestmentProps): Promise<UpdateInvestmentResponse> {
    const response = await api.patch(`investments/${data.id}`, {
      json: {
        ...data,
        amount: masks.removeMask(data.amount),
      },
    });

    return response.json();
  },
  async delete(id: string): Promise<DeleteInvestmentResponse> {
    const response = await api.delete(`investments/${id}`);

    return response.json();
  },
};
