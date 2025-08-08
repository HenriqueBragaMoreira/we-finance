export interface SummaryCardsResponseDto {
  totalRevenues: number;
  totalExpenses: number;
  totalInvestments: number;
  balance: number;
  period: string;
}

export interface ExpensesByCategoryResponseDto {
  categoryName: string;
  amount: number;
  percentage: number;
}

export interface RevenuesVsExpensesResponseDto {
  revenues: number;
  expenses: number;
  period: string;
}

export interface TransactionResponseDto {
  id: string;
  name: string;
  amount: number;
  type: "INCOME" | "EXPENSE" | "INVESTMENT";
  status?: string;
  date: Date;
  category: string;
  paymentMethod?: string;
  user: string;
  createdAt: Date;
}

export interface LastTransactionsResponseDto {
  data: TransactionResponseDto[];
  totalLength: number;
}
