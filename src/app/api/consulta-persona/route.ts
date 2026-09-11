import { NextRequest, NextResponse } from "next/server";
import { consultaPersonaSchema, type PerfilPrueba } from "@/lib/validation/solicitud";
import perfilesData from "@/data/perfiles-prueba.json";

export const runtime = "nodejs";

const perfiles = perfilesData.perfiles as PerfilPrueba[];

// Simula la latencia de una consulta externa de identidad.
const CONSULTA_SIMULADA_MS = 5000;

// Simulación de consulta de identidad contra banco de perfiles de prueba.
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

  // Devuelve los datos del perfil coincidente para prerellenar el formulario.
  return NextResponse.json(perfil, { status: 200 });
}
