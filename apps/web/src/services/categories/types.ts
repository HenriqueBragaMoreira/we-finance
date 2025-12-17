type CategoriesType = "INCOME" | "EXPENSE" | "INVESTMENT";

export type GetCategoriesProps = {
  page?: string;
  rowsPerPage?: string;
  name?: string;
  type?: string;
  status?: string;
  isActive?: string;
  color?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type GetCategoriesResponse = {
  data: GetCategoriesResponseDataField[];
  totalLength: number;
  activeCount: number;
  inactiveCount: number;
};

export type GetCategoriesResponseDataField = {
  id: string;
  name: string;
  type: CategoriesType;
  color: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateCategoryProps = {
  name: string;
  type: CategoriesType;
  color: string;
};

export type CreateCategoryResponse = GetCategoriesResponseDataField;

export type UpdateCategoryProps = Partial<CreateCategoryProps> & {
  isActive?: boolean;
};

export type UpdateCategoryResponse = GetCategoriesResponseDataField;

export type DeleteCategoryResponse = GetCategoriesResponseDataField;
