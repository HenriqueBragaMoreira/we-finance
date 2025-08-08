"use client";

import {
  DashboardFilters,
  type FilterOptionsType,
} from "@/app/(application)/dashboard/components/dashboard-filters";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { routes } from "@/routes/routes";
import { usersServices } from "@/services/users";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, History, UsersRound } from "lucide-react";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./mode-toggle";

export function AppHeader() {
  const currentPath = usePathname();

  const { data } = useQuery({
    queryKey: ["get-users"],
    queryFn: async () => await usersServices.get(),
    enabled: currentPath === "/dashboard",
  });

  const currentRoute = routes.find((route) => route.path === currentPath);

  const filterOptions: FilterOptionsType[] = [
    {
      label: "Pessoa",
      value: "person",
      icon: <UsersRound className="size-4" />,
      variant: "select",
      options: data?.data.map((user) => ({
        label: user.name,
        value: user.id,
      })),
    },
    {
      label: "Mês",
      value: "month",
      icon: <CalendarDays className="size-4" />,
      variant: "multiSelect",
      options: [
        { value: "janeiro", label: "Janeiro" },
        { value: "fevereiro", label: "Fevereiro" },
        { value: "março", label: "Março" },
        { value: "abril", label: "Abril" },
        { value: "maio", label: "Maio" },
        { value: "junho", label: "Junho" },
        { value: "julho", label: "Julho" },
        { value: "agosto", label: "Agosto" },
        { value: "setembro", label: "Setembro" },
        { value: "outubro", label: "Outubro" },
        { value: "novembro", label: "Novembro" },
        { value: "dezembro", label: "Dezembro" },
      ],
    },
    {
      label: "Ano",
      value: "year",
      icon: <History className="size-4" />,
      variant: "multiSelect",
      options: [
        { value: "2024", label: "2024" },
        { value: "2025", label: "2025" },
      ],
    },
  ];

  return (
    <header className="flex flex-wrap gap-3 min-h-20 py-4 shrink-0 items-center transition-all ease-linear border-b">
      <div className="flex flex-1 items-center gap-2">
        <SidebarTrigger className="-ms-1" />
        <div className="max-lg:hidden lg:contents">
          <Separator orientation="vertical" className="me-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {currentRoute?.path !== "/dashboard" && (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink href={routes[0].path}>
                      {routes[0].title}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </>
              )}
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {currentRoute?.title ?? "Tela não encontrada"}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {currentRoute?.path === "/dashboard" && (
          <DashboardFilters filterOptions={filterOptions} />
        )}

        <ModeToggle />
      </div>
    </header>
  );
}
