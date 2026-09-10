import type { Metadata } from "next";
import { Public_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
  weight: ["400", "500", "600", "700", "800"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Exoneración de Multas de Tránsito · PNC Guatemala",
  description:
    "Trámite oficial y gratuito de exoneración de multas por renovación tardía de licencia por fuerza mayor bajo el Acuerdo Gubernativo 59-2012.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={cn("h-full antialiased", publicSans.variable, spaceGrotesk.variable)}
    >
      <body className="min-h-full flex flex-col font-sans bg-white text-slate-900">
        {children}
      </body>
    </html>
  );
}
