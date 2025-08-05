export type GetExpenseProps = {
  page: string;
  rowsPerPage: string;
  description?: string;
  category?: string;
  paymentMethod?: string;
  expenseType?: string;
  status?: string;
  amount?: string;
  date?: string;
  person?: string;
};

export type GetExpenseResponse = {
  data: GetExpenseResponseDataField[];
  total: number;
};

export type GetExpenseResponseDataField = {
  id: string;
  name: string;
  expenseType: string;
  amount: number;
  spentAt: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  installments: GetExpenseResponseInstallmentField[];
  user: string;
  category: string;
  paymentMethod: string;
};

export type GetExpenseResponseInstallmentField = {
  id: string;
  amount: number;
  dueDate: string;
  number: number;
  status: string;
};

export type GetExpenseMonthlyStatsResponse = {
  totalExpenses: number;
  paid: number;
  pending: number;
  month: string;
};
