import { api } from "@/lib/ky";
import { queryParamsBuilder } from "@/utils/query-params-builder";
import type {
  CreateCategoryProps,
  CreateCategoryResponse,
  DeleteCategoryResponse,
  GetCategoriesProps,
  GetCategoriesResponse,
  UpdateCategoryProps,
  UpdateCategoryResponse,
} from "./types";

export const categoriesServices = {
  async get(data?: GetCategoriesProps): Promise<GetCategoriesResponse> {
    const { params: searchParams } = queryParamsBuilder([
      { param: "init", value: data?.page },
      { param: "limit", value: data?.rowsPerPage },
      { param: "name", value: data?.name },
      { param: "type", value: data?.type },
      { param: "status", value: data?.status },
      { param: "isActive", value: data?.isActive },
      { param: "color", value: data?.color },
      { param: "createdAt", value: data?.createdAt },
      { param: "updatedAt", value: data?.updatedAt },
    ]);

    const response = await api.get("categories", { searchParams });

    return response.json();
  },
  async create(data: CreateCategoryProps): Promise<CreateCategoryResponse> {
    const response = await api.post("categories", {
      json: data,
    });

    return response.json();
  },
  update: async (
    data: UpdateCategoryProps,
    id: string
  ): Promise<UpdateCategoryResponse> => {
    const response = await api.patch(`categories/${id}`, {
      json: data,
    });

    return response.json();
  },
  delete: async (id: string): Promise<DeleteCategoryResponse> => {
    const response = await api.delete(`categories/${id}`);

    return response.json();
  },
};
