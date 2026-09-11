import { SolicitudDetailPanel } from "@/features/admin-review";

export default async function AdminSolicitudDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-4 p-4">
      <SolicitudDetailPanel id={id} />
    </main>
  );
}
