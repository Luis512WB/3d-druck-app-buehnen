"use client";

import { useFormStatus } from "react-dom";
import { KNOPF } from "./formular";

export function AbsendeKnopf({
  children,
  className = KNOPF,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} className={className}>
      {pending ? "Bitte warten …" : children}
    </button>
  );
}

// Knopf für Löschen und Ähnliches: fragt vor dem Absenden des umgebenden Formulars nach.
export function BestaetigenKnopf({
  frage,
  children,
  className,
}: {
  frage: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      className={className}
      onClick={(e) => {
        if (!window.confirm(frage)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}

// Auswahlfeld, das sein Formular beim Ändern sofort absendet (Status, Filter).
export function AutoAuswahl(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} onChange={(e) => e.currentTarget.form?.requestSubmit()} />;
}
