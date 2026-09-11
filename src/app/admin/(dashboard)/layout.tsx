import type { ReactNode } from "react";
import { AdminShell } from "@/features/admin-review";

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
