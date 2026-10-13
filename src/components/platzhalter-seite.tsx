import { erfordereBenutzer } from "@/lib/auth";
import { Leerzustand, Seitenkopf } from "@/components/ui/seite";

// Für Bereiche, die laut docs/ROADMAP.md erst in einer späteren Phase gebaut werden.
export async function PlatzhalterSeite(props: { titel: string; text: string; leerTitel: string; leerText: string }) {
  await erfordereBenutzer();

  return (
    <>
      <Seitenkopf titel={props.titel} text={props.text} />
      <Leerzustand titel={props.leerTitel} text={props.leerText} />
    </>
  );
}
