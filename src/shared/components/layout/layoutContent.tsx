"use client";

import { usePathname } from "next/navigation";
import AppShell from "./appshell";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // I-check kung ang user ay nasa login page
  const isLoginPage = pathname === "/login";

  // Kung login page, wag ipakita ang AppShell (Sidebar, etc.)
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Para sa lahat ng ibang pages, ipakita ang AppShell
  return <AppShell>{children}</AppShell>;
}