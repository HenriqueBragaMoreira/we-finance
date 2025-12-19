import { api } from "@/lib/ky";
import { queryParamsBuilder } from "@/utils/query-params-builder";
import type {
  CreatePaymentMethodProps,
  CreatePaymentMethodResponse,
  DeletePaymentMethodResponse,
  GetPaymentMethodsProps,
  GetPaymentMethodsResponse,
  UpdatePaymentMethodProps,
  UpdatePaymentMethodResponse,
} from "./types";

export const paymentMethodsServices = {
  get: async (
    data?: GetPaymentMethodsProps
  ): Promise<GetPaymentMethodsResponse> => {
    const { params: searchParams } = queryParamsBuilder([
      { param: "init", value: data?.init },
      { param: "limit", value: data?.limit },
      { param: "name", value: data?.name },
      { param: "isActive", value: data?.status },
      { param: "createdAt", value: data?.createdAt },
      { param: "updatedAt", value: data?.updatedAt },
    ]);

    const response = await api.get("payment-methods", { searchParams });

    return response.json();
  },
  create: async (
    data: CreatePaymentMethodProps
  ): Promise<CreatePaymentMethodResponse> => {
    const response = await api.post("payment-methods", {
      json: data,
    });

    return response.json();
  },
  update: async (
    data: Partial<UpdatePaymentMethodProps>,
    id: string
  ): Promise<UpdatePaymentMethodResponse> => {
    const response = await api.patch(`payment-methods/${id}`, {
      json: data,
    });

    return response.json();
  },
  delete: async (id: string): Promise<DeletePaymentMethodResponse> => {
    const response = await api.delete(`payment-methods/${id}`);

    return response.json();
  },
};
