"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import logo from "@/app/favicon.ico";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuLink,
} from "@/components/ui/sidebar";
import { type RoutesType, routes } from "@/routes/routes";
import { NavUser } from "./nav-user";

const data = [
  {
    title: "Geral",
    items: routes,
  },
] as {
  title: string;
  items: RoutesType[];
}[];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader className="h-16 max-md:mt-2 mb-2 justify-center">
        <Image
          alt=""
          src={logo}
          draggable={false}
          className="size-14 group-data-[collapsible=icon]:size-8 transition-[width,height] duration-200 ease-in-out select-none"
        />
      </SidebarHeader>
      <SidebarContent className="-mt-2">
        {data.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel className="uppercase text-muted-foreground">
              {item.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem className="mt-2" key={item.title}>
                    <SidebarMenuLink
                      className="group/menu-button group-data-[collapsible=icon]:px-[5px]! gap-3 h-9 [&>svg]:size-auto"
                      tooltip={item.title}
                      isActive={pathname === item.path}
                      href={item.path}
                    >
                      {item.icon && (
                        <item.icon
                          className="text-muted-foreground/65 group-data-[active=true]/menu-button:text-primary"
                          size={22}
                          aria-hidden="true"
                        />
                      )}
                      <span className="text-muted-foreground/65 group-data-[active=true]/menu-button:text-primary">
                        {item.title}
                      </span>
                    </SidebarMenuLink>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
