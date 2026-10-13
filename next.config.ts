import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Bewusst aus: Jede Seite liegt hinter der Anmeldung und liest frische Daten.
  // Begründung siehe docs/ENTSCHEIDUNGEN.md (E-10).
  cacheComponents: false,
  // Handyfotos und CAD-Dateien werden über Server Actions hochgeladen.
  experimental: {
    serverActions: { bodySizeLimit: "200mb" },
  },
  // sharp bringt eigene Binärdateien mit und darf nicht gebündelt werden.
  serverExternalPackages: ["sharp"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
