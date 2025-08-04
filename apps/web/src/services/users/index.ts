import { api } from "@/lib/ky";
import { queryParamsBuilder } from "@/utils/query-params-builder";
import type { GetUsersProps, GetUsersResponse } from "./types";

export const usersServices = {
  get: async (data?: GetUsersProps): Promise<GetUsersResponse> => {
    const { params: searchParams } = queryParamsBuilder([
      { param: "init", value: data?.init },
      { param: "limit", value: data?.limit },
      { param: "name", value: data?.name },
      { param: "email", value: data?.email },
      {
        param: "emailVerified",
        value: data?.emailVerified ? String(data.emailVerified) : undefined,
      },
    ]);

    const response = await api.get("users", { searchParams });

    return response.json();
  },
};
