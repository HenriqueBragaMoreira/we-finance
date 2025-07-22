import { DashboardHeader } from "./components/dashboard-header";

export default function DashboardPage() {
  return (
    <>
      <DashboardHeader />

      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-4 text-muted-foreground">Welcome to your dashboard!</p>
      </div>
    </>
  );
}
