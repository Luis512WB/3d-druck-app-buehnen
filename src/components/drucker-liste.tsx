import type { Drucker } from "@prisma/client";
import { DRUCKER_ZUSTAND, type DruckerZustand } from "@/lib/werte";
import { Chip, Karte } from "@/components/ui/seite";

export function DruckerListe({ drucker }: { drucker: Drucker[] }) {
  return (
    <Karte className="divide-y divide-linie">
      {drucker.map((d) => (
        <div key={d.id} className="flex items-center justify-between gap-4 px-5 py-4">
          <div>
            <div className="font-medium">{d.name}</div>
            <div className="text-sm text-gedaempft tabular-nums">
              {d.bauraumXMm} × {d.bauraumYMm} × {d.bauraumZMm} mm
              {d.anzahlMaterialien > 1 && ` · ${d.anzahlMaterialien} Materialien gleichzeitig`}
            </div>
          </div>
          <Chip farbe={d.zustand === "BEREIT" ? "#16a34a" : "#f59e0b"}>
            {DRUCKER_ZUSTAND[d.zustand as DruckerZustand] ?? d.zustand}
          </Chip>
        </div>
      ))}
    </Karte>
  );
}
