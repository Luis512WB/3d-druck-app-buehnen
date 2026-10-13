import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Bewusst aus: Jede Seite liegt hinter der Anmeldung und liest frische Daten.
  // Begründung siehe docs/ENTSCHEIDUNGEN.md (E-10).
  cacheComponents: false,
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
