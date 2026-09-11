import { TrackerView } from "@/features/tracker";

export default async function SeguimientoPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return (
    <main className="mx-auto flex max-w-lg flex-col gap-4 p-4">
      <TrackerView token={token} />
    </main>
  );
}
