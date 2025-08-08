import { ChartBarMultiple } from "./components/chart-bar-multiple";
import { ChartPieSimple } from "./components/chart-pie-simple";
import { DashboardHeaderCards } from "./components/dashboard-header-cards";
import { RecentTransactions } from "./components/recent-transactions";

export default function DashboardPage() {
  return (
    <>
      <DashboardHeaderCards />

      <div className="grid lg:grid-cols-2 gap-6">
        <ChartPieSimple />

        <ChartBarMultiple />
      </div>

      <RecentTransactions />
    </>
  );
}
