import { prisma, type PrismaTransactionClient } from "@/lib/prisma";

/**
 * Genera el siguiente numeroExpediente de forma segura ante concurrencia,
 * usando la fila única de la tabla Sequence como contador transaccional.
 * Formato: EXP-PNC-{AÑO}-{6 dígitos}.
 */
export async function generateNumeroExpediente(): Promise<string> {
  const year = new Date().getFullYear();

  const counter = await prisma.$transaction(async (tx: PrismaTransactionClient) => {
    const existing = await tx.sequence.findUnique({ where: { id: "expediente" } });

    if (!existing || existing.year !== year) {
      const created = await tx.sequence.upsert({
        where: { id: "expediente" },
        create: { id: "expediente", year, counter: 1 },
        update: { year, counter: 1 },
      });
      return created.counter;
    }

    const updated = await tx.sequence.update({
      where: { id: "expediente" },
      data: { counter: { increment: 1 } },
    });
    return updated.counter;
  });

  const padded = String(counter).padStart(6, "0");
  return `EXP-PNC-${year}-${padded}`;
}
