import { TrackerView } from "@/features/tracker";

export default async function SeguimientoPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return (
    <main className="min-h-screen bg-linear-to-b from-blue-50/40 via-white to-white px-4 py-10 sm:py-16">
      <div className="mx-auto flex max-w-xl flex-col gap-4">
        <TrackerView token={token} />
      </div>
    </main>
  );
}
