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
  expenseType: "FIXED" | "VARIABLE";
  amount: number;
  spentAt: string;
  status: "PAID" | "PENDING";
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

export type CreateExpenseProps = {
  name: string;
  expenseType: "FIXED" | "VARIABLE";
  amount: string;
  spentAt: Date;
  status: "PAID" | "PENDING";
  category: string;
  paymentMethod: string;
  installmentsCount?: string;
};

export type CreateExpenseResponse = {
  id: string;
  name: string;
  expenseType: "FIXED" | "VARIABLE";
  amount: number;
  spentAt: string;
  status: "PAID" | "PENDING";
  createdAt: string;
  updatedAt: string;
  installments: GetExpenseResponseInstallmentField[];
  user: string;
  category: string;
  paymentMethod: string;
};

export type UpdateExpenseProps = CreateExpenseProps & {
  id: string;
};

export type UpdateExpenseResponse = CreateExpenseResponse;

export type DeleteExpenseResponse = CreateExpenseResponse;
