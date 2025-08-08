export type DashboardRoutesFilters = {
  userId?: string;
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
  revenues: number;
  expenses: number;
  period: string;
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
