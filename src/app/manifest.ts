import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Druckaufträge · Wuppertaler Bühnen",
    short_name: "Druckaufträge",
    description: "3D-Druck-Aufträge dokumentieren und planen",
    start_url: "/",
    display: "standalone",
    background_color: "#111315",
    theme_color: "#111315",
    lang: "de",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
