import { Suspense } from "react";
import { Navigation } from "@/components/layout/navigation";
import { abmelden } from "@/server/anmeldung";

function Abmelden() {
  return (
    <form action={abmelden}>
      <button className="w-full rounded-lg px-3 py-2.5 text-left text-sm text-gedaempft hover:bg-hintergrund hover:text-schrift">
        Abmelden
      </button>
    </form>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense>
        <Navigation fuss={<Abmelden />} />
      </Suspense>
      <div className="md:pl-56">
        <main className="mx-auto max-w-5xl px-4 pt-6 pb-24 md:px-8 md:pt-8 md:pb-10">
          {children}
        </main>
      </div>
    </>
  );
}
