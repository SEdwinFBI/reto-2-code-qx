// Catálogo central de las 3 causales de exoneración (Acuerdo Gubernativo 59-2012).
export const CAUSALES = {
  FUERA_DEL_PAIS: {
    codigoFormulario: "24",
    casilla: "Casilla 24",
    gae: "3111",
    titulo: "Estar Fuera del País",
    descripcion:
      "Haberse encontrado fuera de Guatemala al momento en que caducó la licencia.",
    requisitoComprobante:
      "Certificación de Movimiento Migratorio (IGM) o pasaporte con sellos.",
  },
  ENFERMEDAD_ACCIDENTE: {
    codigoFormulario: "25",
    casilla: "Casilla 25",
    gae: "3112",
    titulo: "Enfermedad o Accidente",
    descripcion: "Hospitalización, reposo prescrito o impedimento físico.",
    requisitoComprobante:
      "Certificación médica original (IGSS, red pública o colegiado activo).",
  },
  PRIVADO_LIBERTAD: {
    codigoFormulario: "26",
    casilla: "Casilla 26",
    gae: "3113",
    titulo: "Privado de Libertad",
    descripcion: "Prisión preventiva o cumplimiento de condena penal.",
    requisitoComprobante:
      "Certificación de la Dirección General del Sistema Penitenciario.",
  },
} as const;

export type CausalKey = keyof typeof CAUSALES;

export const CAUSAL_KEYS = Object.keys(CAUSALES) as CausalKey[];

export function isCausalKey(value: string): value is CausalKey {
  return value in CAUSALES;
}
