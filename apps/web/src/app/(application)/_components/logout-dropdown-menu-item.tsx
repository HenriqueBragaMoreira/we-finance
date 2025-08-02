"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth";

export function LogoutDropdownMenuItem() {
  const router = useRouter();

  function handleSignOut() {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  }

  return (
    <DropdownMenuItem onClick={handleSignOut} className="gap-3 px-1">
      <LogOut size={20} className="text-destructive/70" aria-hidden="true" />
      <span>Sair</span>
    </DropdownMenuItem>
  );
}
