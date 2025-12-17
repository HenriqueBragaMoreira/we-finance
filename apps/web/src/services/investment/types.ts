export type GetInvestmentsProps = {
  page?: string;
  rowsPerPage?: string;
  categoryId?: string;
  person?: string;
  investedAt?: string;
  notes?: string;
  amount?: string;
};

export type GetInvestmentResponse = {
  data: GetInvestmentResponseDataField[];
  totalLength: number;
};

export type GetInvestmentResponseDataField = {
  id: string;
  amount: number;
  investedAt: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
  };
  category: {
    id: string;
    name: string;
  };
};

export type GetInvestmentMonthlyStatsResponse = {
  totalInvestments: number;
  month: string;
  userStats: GetInvestmentMonthlyStatsResponseUserStatsField[];
};

export type GetInvestmentMonthlyStatsResponseUserStatsField = {
  name: string;
  amount: number;
};

export type CreateInvestmentProps = {
  notes: string;
  amount: string;
  investedAt: string;
  categoryId: string;
};

export type CreateInvestmentResponse = {
  id: string;
  amount: number;
  investedAt: string;
  notes: string;
  user: {
    id: string;
    name: string;
  };
  category: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type UpdateInvestmentProps = CreateInvestmentProps & {
  id: string;
};

export type UpdateInvestmentResponse = DeleteInvestmentResponse;

export type DeleteInvestmentResponse = CreateInvestmentResponse;
