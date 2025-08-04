export type GetPaymentMethodsProps = {
  init?: string;
  limit?: string;
  name?: string;
  isActive?: boolean;
};

export type GetPaymentMethodsResponse = {
  data: GetPaymentMethodsResponseDataField[];
  totalLength: number;
};

export type GetPaymentMethodsResponseDataField = {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
