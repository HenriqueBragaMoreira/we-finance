import { api } from "@/lib/ky";
import { queryParamsBuilder } from "@/utils/query-params-builder";
import type {
  DashboardRoutesFilters,
  GetExpensesByCategoryResponse,
  GetLastTransactionsProps,
  GetLastTransactionsResponse,
  GetRevenuesVsExpensesResponse,
  GetSummaryCardsResponse,
} from "./types";

export const dashboardServices = {
  getSummaryCards: async (
    filter?: DashboardRoutesFilters
  ): Promise<GetSummaryCardsResponse> => {
    const { params: searchParams } = queryParamsBuilder([
      { param: "userId", value: filter?.person },
      { param: "month", value: filter?.month },
      { param: "year", value: filter?.year },
    ]);

    const response = await api.get("dashboard/summary", { searchParams });

    return response.json();
  },
  getExpensesByCategory: async (
    filter?: DashboardRoutesFilters
  ): Promise<GetExpensesByCategoryResponse[]> => {
    const { params: searchParams } = queryParamsBuilder([
      { param: "userId", value: filter?.person },
      { param: "month", value: filter?.month },
      { param: "year", value: filter?.year },
    ]);

    const response = await api.get("dashboard/expenses-by-category", {
      searchParams,
    });

    return response.json();
  },
  getRevenuesVsExpenses: async (
    filter?: DashboardRoutesFilters
  ): Promise<GetRevenuesVsExpensesResponse> => {
    const { params: searchParams } = queryParamsBuilder([
      { param: "userId", value: filter?.person },
      { param: "month", value: filter?.month },
      { param: "year", value: filter?.year },
    ]);

    const response = await api.get("dashboard/revenues-vs-expenses", {
      searchParams,
    });

    return response.json();
  },
  getLastTransactions: async (
    filter?: GetLastTransactionsProps
  ): Promise<GetLastTransactionsResponse> => {
    const { params: searchParams } = queryParamsBuilder([
      { param: "init", value: filter?.init ?? "0" },
      { param: "limit", value: filter?.limit ?? "10" },
      { param: "userId", value: filter?.person },
      { param: "month", value: filter?.month },
      { param: "year", value: filter?.year },
    ]);

    const response = await api.get("dashboard/transactions", {
      searchParams,
    });

    return response.json();
  },
};
