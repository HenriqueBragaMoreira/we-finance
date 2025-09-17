import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth";
import { Ellipsis, UserRound } from "lucide-react";
import { LogoutDropdownMenuItem } from "./logout-dropdown-menu-item";

export function NavUser() {
  const { isMobile } = useSidebar();
  const { data, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            className="bg-accent text-foreground"
            disabled
          >
            <Skeleton className="bg-gray-400/60 size-7 rounded-full" />
            <div className="in-data-[state=collapsed]:hidden grid flex-1 text-left text-sm leading-tight ms-1">
              <Skeleton className="bg-gray-400/60 h-4 w-full" />
            </div>
            <div className="size-8 rounded-lg flex items-center justify-center bg-sidebar-accent/50 in-data-[state=collapsed]:hidden">
              <Skeleton className="bg-gray-400/60 size-8" />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="bg-accent text-foreground data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="in-data-[state=expanded]:size-6 transition-[width,height] duration-200 ease-in-out">
                <AvatarImage
                  src={data?.user.image ?? undefined}
                  alt={data?.user.name}
                />
                <AvatarFallback>{data?.user.name?.slice(0, 1)}</AvatarFallback>
              </Avatar>
              <div className="in-data-[state=collapsed]:hidden grid flex-1 text-left text-sm leading-tight ms-1">
                <span className="truncate font-medium">{data?.user.name}</span>
              </div>
              <div className="size-8 rounded-lg flex items-center justify-center bg-sidebar-accent/50 in-data-[state=collapsed]:hidden in-[[data-slot=dropdown-menu-trigger]:hover]:bg-transparent">
                <Ellipsis className="size-5 opacity-40" size={20} />
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuItem className="gap-3 px-1">
              <UserRound
                size={20}
                className="text-muted-foreground/70"
                aria-hidden="true"
              />
              <span>Perfil</span>
            </DropdownMenuItem>

            <LogoutDropdownMenuItem />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
