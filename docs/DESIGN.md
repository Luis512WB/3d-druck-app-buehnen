# Design

Leitbild: **schlicht, modern, ruhig.** Die Inhalte (Bilder, Maße, Status) stehen im Vordergrund, nicht die Oberfläche.

## Grundsätze

1. **Mobil zuerst.** Jede Ansicht wird für das Handy entworfen und am Desktop erweitert – nicht umgekehrt.
2. **Wenig Farbe, gezielt eingesetzt.** Neutrale Flächen; Farbe nur für Priorität, Status, Abteilung und die eine Hauptaktion pro Seite.
3. **Eine Hauptaktion pro Ansicht.** Gut erreichbar mit dem Daumen (mobil unten rechts).
4. **Schnell erfassen, später verfeinern.** Kurze Formulare, optionale Felder eingeklappt.
5. **Hell und dunkel.** Folgt der Geräteeinstellung – dunkel ist auf der Bühne und im Zuschauerraum wichtig.

## Farben

| Zweck | Hell | Dunkel |
|---|---|---|
| Hintergrund | `#FAFAFA` | `#0F1113` |
| Fläche (Karten) | `#FFFFFF` | `#181B1F` |
| Linie | `#E5E7EB` | `#2A2E34` |
| Text | `#111827` | `#F3F4F6` |
| Text gedämpft | `#6B7280` | `#9CA3AF` |
| Akzent | `#2563EB` | `#60A5FA` |

**Priorität:** Niedrig – Grau · Mittel – Blau · Hoch – Orange · Dringend – Rot. Immer mit Text oder Symbol, nie nur über Farbe.

**Status:** als kleine Chips; „Im Druck“ hervorgehoben, „Fertig/Geliefert“ grün, „Pausiert/Abgebrochen“ gedämpft.

**Filamentfarbe:** kleiner Farbpunkt neben der Bezeichnung.

## Typografie und Form

- Schrift: Systemschrift bzw. Inter; Zahlen (Maße, Gramm) mit Tabellenziffern.
- Größen: 16 px Fließtext (verhindert Zoom in iOS-Formularen), klare Überschriften-Stufen.
- Ecken 10–12 px, dezente Linien statt kräftiger Schatten, großzügige Abstände.
- Touch-Ziele mindestens 44 × 44 px.

## Navigation

- **Handy:** Leiste unten – Übersicht · Stücke · Aufträge · Planung · Mehr. Schwebender „+“-Knopf für neuen Auftrag.
- **Desktop:** Schmale Seitenleiste links mit denselben Punkten, Inhalt mittig mit begrenzter Breite; Detailseiten zweispaltig.

## Zentrale Ansichten

**Übersicht** – „Läuft gerade“ (Drucker mit aktuellem Job), „Als Nächstes fällig“, „Dringend“, zuletzt bearbeitet.

**Stücke** – Kacheln mit Titelbild, Titel, Spielzeit, Anzahl offener Aufträge.

**Stück-Detail** – Kopf mit Eckdaten, darunter die Aufträge (filterbar), Summen für Filament und Druckzeit.

**Aufträge** – Umschaltbar Liste / Board. Karte zeigt: Miniaturbild, Titel, Stück, Abteilung, Priorität, Status, Termin, Farbpunkt + Gramm.

**Auftrag-Detail**
- Handy: Abschnitte untereinander – Kopf (Status/Priorität direkt änderbar), Bilder, Maße, Druckdaten, Notizen, Dateien, Druckjobs.
- Desktop: links Bildergalerie groß, rechts Maße und Druckdaten – gedacht für den zweiten Bildschirm neben dem CAD.

**Neuer Auftrag (Handy)** – Titel, Stück, Abteilung, Priorität → Foto hinzufügen → Maße → speichern. Weitere Felder unter „Mehr Angaben“.

**Planung** – Zeitleiste: eine Zeile pro Drucker, Balken pro Druckjob, Tag-/Wochenansicht. Mobil als Liste je Drucker. Überschneidungen und Bauraum-Probleme deutlich markiert.

## Verhalten

- Speichern bestätigt kurz und unaufdringlich; Fehler stehen direkt am betroffenen Feld.
- Löschen immer mit Rückfrage; Archivieren ist der bevorzugte Weg.
- Leere Zustände erklären den nächsten Schritt („Noch keine Aufträge – ersten Auftrag anlegen“).
- Bilder laden als Miniatur, Vollansicht mit Wischen und Zoom.
