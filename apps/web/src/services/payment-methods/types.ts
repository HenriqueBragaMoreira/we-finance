export type GetPaymentMethodsProps = {
  init?: string;
  limit?: string;
  name?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type GetPaymentMethodsResponse = {
  data: GetPaymentMethodsResponseDataField[];
  totalLength: number;
  activeCount: number;
  inactiveCount: number;
};

export type GetPaymentMethodsResponseDataField = {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreatePaymentMethodProps = {
  name: string;
  isActive?: boolean;
};

export type CreatePaymentMethodResponse = GetPaymentMethodsResponseDataField;

export type UpdatePaymentMethodProps = CreatePaymentMethodProps;

export type UpdatePaymentMethodResponse = GetPaymentMethodsResponseDataField;

export type DeletePaymentMethodResponse = GetPaymentMethodsResponseDataField;
