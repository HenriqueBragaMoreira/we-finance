type CategoriesType = "INCOME" | "EXPENSE" | "INVESTMENT";

export type GetCategoriesProps = {
  init?: number;
  limit?: number;
  name?: string;
  type?: CategoriesType;
};

export type GetCategoriesResponse = {
  data: GetCategoriesResponseDataField[];
  totalLength: number;
};

export type GetCategoriesResponseDataField = {
  id: string;
  name: string;
  type: CategoriesType;
  createdAt: string;
  updatedAt: string;
};
