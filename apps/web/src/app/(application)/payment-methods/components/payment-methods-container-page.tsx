"use client";

import { useQuery } from "@tanstack/react-query";
import { parseAsString, useQueryStates } from "nuqs";
import { paymentMethodsServices } from "@/services/payment-methods";
import { DataTableContainer } from "./data-table-container";
import { PaymentMethodsHeaderCards } from "./payment-methods-header-cards";

export function PaymentMethodsContainerPage() {
  const [filters] = useQueryStates({
    name: parseAsString.withDefault(""),
    createdAt: parseAsString.withDefault(""),
    updatedAt: parseAsString.withDefault(""),
    status: parseAsString.withDefault(""),
    page: parseAsString.withDefault("0"),
    rowsPerPage: parseAsString.withDefault("10"),
  });

  const { data, isFetching } = useQuery({
    queryKey: ["get-payment-methods", filters],
    queryFn: async () => {
      return await paymentMethodsServices.get(filters);
    },
  });

  return (
    <>
      <PaymentMethodsHeaderCards data={data} isFetching={isFetching} />

      <DataTableContainer data={data} isFetching={isFetching} />
    </>
  );
}
