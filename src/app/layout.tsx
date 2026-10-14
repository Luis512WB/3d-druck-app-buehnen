import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { DARSTELLUNGEN, type Darstellung } from "@/lib/werte";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Druckaufträge · Wuppertaler Bühnen", template: "%s · Druckaufträge" },
  description: "3D-Druck-Aufträge dokumentieren und planen",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#111315",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Dunkel ist Standard; die Wahl wird unter Einstellungen pro Gerät im Cookie gespeichert.
  const gespeichert = (await cookies()).get("darstellung")?.value;
  const darstellung: Darstellung = gespeichert && gespeichert in DARSTELLUNGEN ? (gespeichert as Darstellung) : "dunkel";

  return (
    <html lang="de" data-theme={darstellung} className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
