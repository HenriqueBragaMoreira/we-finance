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
  incomeType: string;
  amount: string;
  receivedAt: string;
  paymentMethod: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  user: string;
  category: string;
};

export type GetMonthlyStatsResponse = {
  totalRevenues: number;
  received: number;
  pending: number;
  month: string;
};
