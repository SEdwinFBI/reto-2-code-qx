import { SolicitudesTable } from "@/features/admin-review";

export default function AdminSolicitudesPage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-4 p-4">
      <h1 className="text-xl font-semibold">Solicitudes de exoneración</h1>
      <SolicitudesTable />
    </main>
  );
}
