"use client";

import { usePathname } from "next/navigation";
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

const user = {
  name: "Henrique Braga",
  email: "henrique@braga.com",
  avatar: "https://avatars.githubusercontent.com/u/94729971?v=4",
};

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader className="h-16 max-md:mt-2 mb-2 justify-center">
        <Logo className="size-9 group-data-[collapsible=icon]:size-8 transition-[width,height] duration-200 ease-in-out" />
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
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}

function Logo(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={36}
      height={36}
      viewBox="0 0 36 36"
      aria-hidden="true"
      {...props}
    >
      <path
        fill="url(#:r3v:)"
        fillRule="evenodd"
        d="M12.972 2a6.806 6.806 0 00-4.813 1.993L2 10.153v2.819c0 1.991.856 3.783 2.22 5.028A6.788 6.788 0 002 23.028v2.82l6.16 6.159A6.806 6.806 0 0018 31.78a6.806 6.806 0 009.841.226L34 25.847v-2.819A6.788 6.788 0 0031.78 18 6.788 6.788 0 0034 12.972v-2.82l-6.159-6.159A6.806 6.806 0 0018 4.22 6.788 6.788 0 0012.972 2zm9.635 16a6.741 6.741 0 01-.226-.216L18 13.403l-4.381 4.381a6.741 6.741 0 01-.226.216c.077.07.152.142.226.216L18 22.597l4.381-4.381c.074-.074.15-.146.226-.216zm-2.83 7.848v1.346a3.25 3.25 0 005.55 2.298l5.117-5.117v-1.347a3.25 3.25 0 00-5.549-2.298l-5.117 5.117zm-3.555 0l-5.117-5.118a3.25 3.25 0 00-5.55 2.298v1.347l5.118 5.117a3.25 3.25 0 005.55-2.298v-1.346zm0-17.042v1.347l-5.117 5.117a3.25 3.25 0 01-5.55-2.298v-1.347l5.118-5.117a3.25 3.25 0 015.55 2.298zm8.673 6.464l-5.117-5.117V8.806a3.25 3.25 0 015.549-2.298l5.117 5.117v1.347a3.25 3.25 0 01-5.549 2.298z"
        clipRule="evenodd"
      />
      <defs>
        <linearGradient
          id=":r3v:"
          x1={18}
          x2={18}
          y1={2}
          y2={34}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F4F4F5" />
          <stop offset={1} stopColor="#A1A1AA" />
        </linearGradient>
      </defs>
    </svg>
  );
}
