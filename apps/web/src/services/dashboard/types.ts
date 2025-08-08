export type DashboardRoutesFilters = {
  person?: string;
  month?: string;
  year?: string;
};

export type GetLastTransactionsProps = DashboardRoutesFilters & {
  init?: string;
  limit?: string;
};

export type GetSummaryCardsResponse = {
  totalRevenues: number;
  totalExpenses: number;
  totalInvestments: number;
  balance: number;
  period: string;
};

export type GetExpensesByCategoryResponse = {
  categoryName: string;
  amount: number;
  percentage: number;
};

export type GetRevenuesVsExpensesResponse = {
  data: GetRevenuesVsExpensesResponseDataField[];
  period: string;
};

export type GetRevenuesVsExpensesResponseDataField = {
  month: string;
  revenues: number;
  expenses: number;
};

export type GetLastTransactionsResponse = {
  data: GetLastTransactionsResponseDataField[];
  totalLength: number;
};

export type GetLastTransactionsResponseDataField = {
  id: string;
  name: string;
  amount: number;
  type: string;
  date: string;
  category: string;
  user: string;
  createdAt: string;
  status?: string;
  paymentMethod?: string;
};
