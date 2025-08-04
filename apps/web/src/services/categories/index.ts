import { api } from "@/lib/ky";
import { queryParamsBuilder } from "@/utils/query-params-builder";
import type { GetCategoriesProps, GetCategoriesResponse } from "./types";

export const categoriesServices = {
  async get(data?: GetCategoriesProps): Promise<GetCategoriesResponse> {
    const { params: searchParams } = queryParamsBuilder([
      { param: "init", value: data?.init },
      { param: "limit", value: data?.limit },
      { param: "name", value: data?.name },
      { param: "type", value: data?.type },
    ]);

    const response = await api.get("categories", { searchParams });

    return response.json();
  },
};
