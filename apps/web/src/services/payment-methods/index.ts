import { api } from "@/lib/ky";
import { queryParamsBuilder } from "@/utils/query-params-builder";
import type {
  GetPaymentMethodsProps,
  GetPaymentMethodsResponse,
} from "./types";

export const paymentMethodsServices = {
  get: async (
    data?: GetPaymentMethodsProps
  ): Promise<GetPaymentMethodsResponse> => {
    const { params: searchParams } = queryParamsBuilder([
      { param: "init", value: data?.init },
      { param: "limit", value: data?.limit },
      { param: "name", value: data?.name },
      { param: "isActive", value: String(data?.isActive) },
    ]);

    const response = await api.get("payment-methods", { searchParams });

    return response.json();
  },
};
