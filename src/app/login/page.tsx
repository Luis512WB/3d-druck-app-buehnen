import type { Metadata } from "next";
import { AnmeldeFormular } from "./anmelde-formular";

export const metadata: Metadata = { title: "Anmelden" };

export default function Login() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <svg viewBox="17 0 351 228" className="mb-5 h-8 w-auto text-schrift" fill="currentColor" aria-hidden>
          <path d="M17.41 0l71.661 228h54.537L192.16 60.886h.705L241.065 228H295.6L367.59 0H17.41z" />
        </svg>
        <h1 className="text-2xl font-bold tracking-tight">Druckaufträge</h1>
        <p className="mt-1 mb-6 text-sm text-gedaempft">3D-Druck · Wuppertaler Bühnen</p>
        <AnmeldeFormular />
      </div>
    </main>
  );
}
