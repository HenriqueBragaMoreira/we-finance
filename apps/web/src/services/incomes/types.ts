import type { RevenueSchemaType } from "@/app/(application)/revenues/components/forms/revenue-action-form";

export type GetIncomesProps = {
  description?: string;
  incomeType?: string;
  category?: string;
  amount?: string;
  paymentMethod?: string;
  status?: string;
  date?: string;
  person?: string;
  page?: string;
  rowsPerPage?: string;
};

export type GetIncomesResponse = {
  data: GetIncomesResponseDataField[];
  totalLength: number;
};

export type GetIncomesResponseDataField = {
  id: string;
  name: string;
  incomeType: "FIXED" | "VARIABLE";
  amount: string;
  receivedAt: string;
  paymentMethod: string;
  status: "RECEIVED" | "PENDING";
  createdAt: string;
  updatedAt: string;
  user: string;
  category: string;
};

export type GetIncomesByIdResponse = GetIncomesResponseDataField;

export type GetMonthlyStatsResponse = {
  totalRevenues: number;
  received: number;
  pending: number;
  month: string;
};

export type CreateIncomeProps = RevenueSchemaType;

export type CreateIncomeResponse = GetIncomesResponseDataField;

export type UpdateIncomeProps = RevenueSchemaType & {
  id: string;
};

export type UpdateIncomeResponse = GetIncomesResponseDataField;

export type DeleteIncomeResponse = GetIncomesResponseDataField;
