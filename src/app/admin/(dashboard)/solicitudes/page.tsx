import { Suspense } from "react";
import { SolicitudesTable } from "@/features/admin-review";

export default function AdminSolicitudesPage() {
  return (
    <Suspense>
      <SolicitudesTable />
    </Suspense>
  );
}
