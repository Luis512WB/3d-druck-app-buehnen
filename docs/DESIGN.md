# Design

Leitbild: **schlicht, modern, ruhig.** Die Inhalte (Bilder, Maße, Status) stehen im Vordergrund, nicht die Oberfläche.

## Grundsätze

1. **Werkstattzettel statt Webseite.** Nüchtern und technisch: harte Kanten (3–6 px Radius), Linien statt Schatten, keine Verläufe.
2. **Wenig Farbe, gezielt eingesetzt.** Neutrale Grautöne; Petrol als einzige Signalfarbe (Hauptknopf, „Im Druck“, aktive Navigation). Gedämpftes Rot nur für Überfälliges und Dringendes.
3. **Maschinenschrift für Daten.** Auftragsnummern, Maße, Gramm, Status-Kennzeichen und Abschnittsüberschriften in Monospace.
4. **Mobil zuerst.** Jede Ansicht wird für das Handy entworfen und am Desktop erweitert.
5. **Dunkel als Standard.** Umschaltbar unter Einstellungen (Dunkel / Hell / wie das Gerät), pro Gerät gespeichert.
6. **Status überall direkt änderbar.** In jeder Auftragsliste ist der Status ein Auswahlfeld; „Im Druck“ fragt in einem Fenster nach dem Drucker.
7. **Neues ohne Umweg.** In Auswahlfeldern für Stück, Abteilung und Kategorie gibt es „+ Neu …“ – anlegen, ohne das Formular zu verlassen.

## Farben

| Zweck | Dunkel (Standard) | Hell |
|---|---|---|
| Hintergrund | `#111315` | `#F4F3EF` |
| Fläche | `#181A1D` | `#FFFFFF` |
| Linie | `#2C3035` | `#D9D6CE` |
| Text | `#E7E5E0` | `#1B1B19` |
| Text gedämpft | `#9B988F` | `#6B6860` |
| Akzent (Petrol) | `#4FC1B0` | `#0F8A7E` |
| Warnung | `#E07A74` | `#C0504D` |

**Status:** kleines Farbquadrat bzw. farbige Kante am Auswahlfeld – Angefragt/Pausiert grau, Planung/Konstruktion blaugrau, Druckbereit ocker, Im Druck petrol, Nachbearbeitung ton, Fertig/Geliefert salbeigrün, Abgebrochen gedämpftes Rot.

**Marke:** das „W“ der Wuppertaler Bühnen (Zeichen ohne Schriftzug, von wuppertaler-buehnen.de) neben „Druckaufträge“.

## Typografie und Form

- Schrift: Systemschrift; Monospace (`ui-monospace`, Cascadia Mono, SF Mono) für Daten.
- 16 px in Eingabefeldern (verhindert Zoom in iOS-Formularen).
- Touch-Ziele mindestens 44 × 44 px.

## Navigation

- **Handy:** Leiste unten – Übersicht · Stücke · Aufträge · Maße · Mehr (Planung, Drucker, Einstellungen). Schwebender „+“-Knopf für neuen Auftrag.
- **Desktop:** Schmale Seitenleiste links mit allen Punkten einzeln, Inhalt mittig mit begrenzter Breite; Detailseiten zweispaltig.

## Zentrale Ansichten

**Übersicht** – „Läuft gerade“ (Drucker mit aktuellem Job), „Als Nächstes fällig“, „Dringend“, zuletzt bearbeitet.

**Stücke** – Kacheln mit Titelbild, Titel, Spielzeit, Anzahl offener Aufträge.

**Stück-Detail** – Kopf mit Eckdaten, darunter die Aufträge (filterbar), Summen für Filament und Druckzeit.

**Aufträge** – Umschaltbar Liste / Board. Karte zeigt: Miniaturbild, Titel, Stück, Abteilung, Priorität, Status, Termin, Farbpunkt + Gramm.

**Auftrag-Detail**
- Handy: Abschnitte untereinander – Kopf (Status/Priorität direkt änderbar), Bilder, Maße, Druckdaten, Notizen, Dateien, Druckjobs.
- Desktop: links Bildergalerie groß, rechts Maße und Druckdaten – gedacht für den zweiten Bildschirm neben dem CAD.

**Neuer Auftrag (Handy)** – Titel, Stück, Abteilung, Priorität → Foto hinzufügen → Maße → speichern. Weitere Felder unter „Mehr Angaben“.

**Maßbibliothek** – Suchfeld ganz oben, darunter Kategorien als Chips und die Einträge als kompakte Liste mit Miniaturbild. Eintrag: Zeichnung/Foto, Maßtabelle (Varianten als Zeilen, geprüfte Maße mit Häkchen), Druckhinweis hervorgehoben, Knopf „In Auftrag übernehmen“. Maße lassen sich antippen und kopieren.

**Planung** – Zeitleiste: eine Zeile pro Drucker, Balken pro Druckjob, Tag-/Wochenansicht. Mobil als Liste je Drucker. Überschneidungen und Bauraum-Probleme deutlich markiert.

## Verhalten

- Speichern bestätigt kurz und unaufdringlich; Fehler stehen direkt am betroffenen Feld.
- Löschen immer mit Rückfrage; Archivieren ist der bevorzugte Weg.
- Leere Zustände erklären den nächsten Schritt („Noch keine Aufträge – ersten Auftrag anlegen“).
- Bilder laden als Miniatur, Vollansicht mit Wischen und Zoom.
