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
  amount: string;
  investedAt: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  user: string;
  category: string;
};
