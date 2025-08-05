import { DataTableContainer } from "./components/data-table-container";
import { ExpensesHeaderCards } from "./components/expenses-header-cards";

export default function ExpensesPage() {
  return (
    <>
      <ExpensesHeaderCards />

      <DataTableContainer />
    </>
  );
}
