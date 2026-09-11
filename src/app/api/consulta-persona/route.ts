import { NextRequest, NextResponse } from "next/server";
import { consultaPersonaSchema, type PerfilPrueba } from "@/lib/validation/solicitud";
import perfilesData from "@/data/perfiles-prueba.json";

export const runtime = "nodejs";

const perfiles = perfilesData.perfiles as PerfilPrueba[];

/** Simula la latencia de una consulta externa (SAT/RENAP). */
const CONSULTA_SIMULADA_MS = 5000;

/**
 * Endpoint público que simula la consulta de identidad de una persona (tipo
 * SAT/RENAP) contra un banco de perfiles de prueba (src/data/perfiles-prueba.json),
 * sin conexión a ningún servicio externo real ni a base de datos.
 * Busca coincidencia exacta por cui + fechaNacimiento + serie.
 * Si no hay coincidencia, responde 404 con un cuerpo JSON — no es un error del
 * servidor, es un resultado válido de "no encontrado" que el cliente debe manejar
 * cayendo a llenado manual.
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = consultaPersonaSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Datos de consulta inválidos.",
        details: parsed.error.issues.map((issue) => issue.message).join(" | "),
      },
      { status: 400 }
    );
  }

  await new Promise((resolve) => setTimeout(resolve, CONSULTA_SIMULADA_MS));

  const { cui, fechaNacimiento, serie } = parsed.data;
  const perfil = perfiles.find(
    (p) => p.cui === cui && p.fechaNacimiento === fechaNacimiento && p.serie === serie
  );

  if (!perfil) {
    return NextResponse.json(
      { error: "No se encontró ningún registro con esos datos." },
      { status: 404 }
    );
  }

  // id/genero son metadata interna del banco de prueba; el cliente solo usa los
  // campos que coinciden con SolicitudFormData, así que se devuelve el perfil tal
  // cual y el cliente ignora el resto.
  return NextResponse.json(perfil, { status: 200 });
}
