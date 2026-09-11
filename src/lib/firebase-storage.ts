import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

let app: App;

function getFirebaseApp(): App {
  if (app) return app;
  const existing = getApps()[0];
  if (existing) {
    app = existing;
    return app;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

  if (!projectId || !clientEmail || !privateKey || !storageBucket) {
    throw new Error(
      "Firebase Storage no está configurado: faltan variables de entorno FIREBASE_*"
    );
  }

  app = initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
    storageBucket,
  });
  return app;
}

function getBucket() {
  return getStorage(getFirebaseApp()).bucket();
}

export async function uploadSolicitudFile(params: {
  buffer: Buffer;
  destinationPath: string;
  contentType: string;
}): Promise<{ storagePath: string }> {
  const { buffer, destinationPath, contentType } = params;
  await getBucket().file(destinationPath).save(buffer, {
    contentType,
    resumable: false,
  });
  return { storagePath: destinationPath };
}

export async function getSignedUrl(
  storagePath: string,
  expiresInMs = 15 * 60 * 1000
): Promise<string> {
  const [url] = await getBucket()
    .file(storagePath)
    .getSignedUrl({ action: "read", expires: Date.now() + expiresInMs });
  return url;
}

function extensionFromContentType(contentType: string): string {
  switch (contentType) {
    case "application/pdf":
      return "pdf";
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    default:
      return "bin";
  }
}

export function buildSolicitudFilePath(
  numeroExpediente: string,
  role: "dpi" | "comprobante" | "autorizacion" | "resolucion",
  contentType: string
): string {
  return `solicitudes/${numeroExpediente}/${role}.${extensionFromContentType(contentType)}`;
}
