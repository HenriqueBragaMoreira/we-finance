"use client";

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
import { usePathname } from "next/navigation";
import { ModeToggle } from "./mode-toggle";

export function AppHeader() {
  const currentPath = usePathname();

  const currentRoute = routes.find((route) => route.path === currentPath);

  return (
    <header className="flex flex-wrap gap-3 min-h-20 py-4 shrink-0 items-center transition-all ease-linear border-b">
      <div className="flex flex-1 items-center gap-2">
        <SidebarTrigger className="-ms-1" />
        <div className="max-lg:hidden lg:contents">
          <Separator orientation="vertical" className="me-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {currentPath !== "/dashboard" && (
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

      <ModeToggle />
    </header>
  );
}
