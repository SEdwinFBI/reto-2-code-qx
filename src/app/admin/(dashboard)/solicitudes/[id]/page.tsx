import { SolicitudDetailPanel } from "@/features/admin-review";

export default async function AdminSolicitudDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
      <SolicitudDetailPanel id={id} />
    </div>
  );
}
