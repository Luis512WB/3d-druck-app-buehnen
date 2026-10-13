import type { Metadata } from "next";
import { AnmeldeFormular } from "./anmelde-formular";

export const metadata: Metadata = { title: "Anmelden" };

export default function Login() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold tracking-tight">3D-Druck Bühnen</h1>
        <p className="mt-1 mb-6 text-sm text-gedaempft">Bitte anmelden.</p>
        <AnmeldeFormular />
      </div>
    </main>
  );
}
