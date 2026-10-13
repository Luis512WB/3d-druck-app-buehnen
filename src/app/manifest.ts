import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "3D-Druck Bühnen",
    short_name: "3D-Druck",
    description: "3D-Druck-Aufträge dokumentieren und planen",
    start_url: "/",
    display: "standalone",
    background_color: "#0f1113",
    theme_color: "#0f1113",
    lang: "de",
  };
}
