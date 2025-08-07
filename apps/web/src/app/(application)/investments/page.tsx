import { DataTableContainer } from "./components/data-table-container";
import { InvestmentsHeaderCards } from "./components/investments-header-cards";

export default function InvestmentsPage() {
  return (
    <>
      <InvestmentsHeaderCards />

      <DataTableContainer />
    </>
  );
}
