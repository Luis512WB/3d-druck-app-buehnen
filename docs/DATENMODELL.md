# Datenmodell

Maßgeblich ist später `prisma/schema.prisma`; dieses Dokument beschreibt die fachliche Bedeutung und wird bei jeder Schema-Änderung mitgepflegt.

## Überblick

```
Stueck 1 ──── n Auftrag 1 ──── n Druckjob n ──── 1 Drucker
                  │
                  ├── n Mass
                  ├── n Anhang   (Bilder, CAD-, Slicer-Dateien)
                  └── n Notiz

Bibliothekskategorie 1 ── n Bibliothekseintrag 1 ── n Mass / Anhang

Abteilung 1 ── n Auftrag
Benutzer  1 ── n Auftrag (erstellt von / zugewiesen an)
Filament  1 ── n Druckjob        (ab Ausbaustufe „Filamentlager“)
```

Alle Tabellen haben `id`, `erstelltAm`, `geaendertAm`.

## Stueck

| Feld | Typ | Hinweis |
|---|---|---|
| titel | Text, Pflicht | z. B. „Otello“ |
| sparte | Auswahl | Oper, Schauspiel, Tanz, Konzert, Sonstiges |
| spielzeit | Text | z. B. „2026/27“ |
| premiere | Datum | optional |
| spielstaette | Text | z. B. Opernhaus |
| ansprechpersonen | Text | Bühnenbild, Regie, Produktionsleitung … |
| notizen | Langtext | |
| titelbildId | → Anhang | optional |
| status | Auswahl | In Vorbereitung, Aktiv, Abgespielt, Archiviert |

## Auftrag

| Feld | Typ | Hinweis |
|---|---|---|
| nummer | Text, eindeutig | automatisch fortlaufend, `WB-1`, `WB-2` … (wie bisher in Notion) |
| titel | Text, Pflicht | |
| beschreibung | Langtext | |
| stueckId | → Stueck | leer = „Allgemein“ (Auftrag ohne Produktion) |
| abteilungId | → Abteilung | |
| ansprechperson | Text | Name oder E-Mail aus der Abteilung |
| umfang | Auswahl | Nur Druck, Konstruktion + Druck |
| prioritaet | Auswahl | Niedrig, Mittel, Hoch, Dringend |
| status | Auswahl | siehe unten |
| erhaltenAm | Datum | Auftrag erhalten am, Standard: heute |
| faelligAm | Datum | Deadline |
| stueckzahl | Ganzzahl | Anzahl Teile, Standard 1 |
| material | Auswahl | PLA, PETG, ABS, ASA, TPU, Sonstiges |
| farbe | Text | Bezeichnung, z. B. „Schwarz matt“ |
| farbeHex | Text | optional, für Farbpunkt in der Oberfläche |
| filamentGeschaetztG | Zahl | Gramm |
| filamentTatsaechlichG | Zahl | Gramm, Summe der Druckjobs oder manuell |
| druckzeitGeschaetztMin | Ganzzahl | Minuten |
| druckzeitTatsaechlichMin | Ganzzahl | Minuten |
| laengeMm, breiteMm, hoeheMm | Zahl | Hauptmaße |
| nachbearbeitung | Text | schleifen, grundieren, lackieren … |
| erstelltVonId | → Benutzer | |
| zugewiesenAnId | → Benutzer | optional |
| abgeschlossenAm | Datum | gesetzt bei „Fertig“ |

**Status:** `ANGEFRAGT`, `IN_PLANUNG`, `KONSTRUKTION`, `DRUCKBEREIT`, `IM_DRUCK`, `NACHBEARBEITUNG`, `FERTIG`, `GELIEFERT`, `PAUSIERT`, `ABGEBROCHEN`

Die Oberfläche zeigt Druckzeiten in Stunden (z. B. „4,2 h“), gespeichert wird in Minuten.

## Mass

Benannte Einzelmaße – zu einem Auftrag **oder** zu einem Eintrag der Maßbibliothek.

| Feld | Typ | Hinweis |
|---|---|---|
| auftragId / bibliothekseintragId | → Auftrag / Bibliothekseintrag | genau eines gesetzt |
| variante | Text | nur Bibliothek: Größe innerhalb einer Reihe, z. B. „M20“ |
| geprueft | Ja/Nein | nur Bibliothek: nachgemessen/erprobt statt nur Datenblatt |
| bezeichnung | Text | „Durchmesser Rohr“ |
| wert | Zahl | |
| einheit | Auswahl | mm (Standard), cm, m, ° |
| notiz | Text | z. B. „mit Spiel +0,3“ |
| reihenfolge | Ganzzahl | Sortierung |

## Bibliothekseintrag

Standardteil oder Standardmaß in der Maßbibliothek, unabhängig von Stücken und Aufträgen.

| Feld | Typ | Hinweis |
|---|---|---|
| titel | Text, Pflicht | z. B. „Kabelverschraubung metrisch“, „DMX-Einbaubuchse 5-pol“ |
| kategorieId | → Bibliothekskategorie | |
| beschreibung | Langtext | |
| druckhinweis | Langtext | erprobte Zugaben/Toleranzen, Material |
| quelle | Text | Datenblatt, Norm, Link oder „selbst gemessen“ |
| schlagworte | Text | für die Suche |
| erstelltVonId | → Benutzer | |

Maße (`Mass`) und Bilder/Zeichnungen/CAD-Dateien (`Anhang`) hängen wie beim Auftrag daran. „In Auftrag übernehmen“ **kopiert** die gewählten Maße – spätere Änderungen in der Bibliothek verändern bestehende Aufträge nicht.

## Bibliothekskategorie

| Feld | Typ | Hinweis |
|---|---|---|
| name | Text, eindeutig | Start: Kabelverschraubungen, Steckverbinder, Gewinde & Schrauben, Rohre & Traversen, Sonstiges |
| reihenfolge | Ganzzahl | |

## Anhang

Metadaten zu einer Datei in `data/uploads`. Gehört zu einem Auftrag, einem Stück **oder** einem Bibliothekseintrag.

| Feld | Typ | Hinweis |
|---|---|---|
| auftragId / stueckId / bibliothekseintragId | → Auftrag / Stueck / Bibliothekseintrag | genau eines gesetzt |
| art | Auswahl | Bild, CAD, Slicer, Dokument, Sonstiges |
| dateiname | Text | Originalname |
| pfad | Text | relativer Pfad im Upload-Ordner |
| vorschauPfad | Text | verkleinertes Bild, nur bei Bildern |
| mimeTyp, groesseBytes | Text, Ganzzahl | |
| beschriftung | Text | |
| hochgeladenVonId | → Benutzer | |

## Notiz

| Feld | Typ | Hinweis |
|---|---|---|
| auftragId | → Auftrag | |
| text | Langtext | |
| autorId | → Benutzer | |
| art | Auswahl | Notiz, Statuswechsel (automatisch), Rückfrage |

## Abteilung

| Feld | Typ | Hinweis |
|---|---|---|
| name | Text, eindeutig | |
| farbeHex | Text | für Kennzeichnung in Listen |
| aktiv | Ja/Nein | ausblenden statt löschen, damit alte Aufträge ihre Abteilung behalten |

**Startbestand:** Beleuchtung, Technik, Schreinerei, Schlosserei, Deko, Requisite, Maske, Schneiderei, Ton. Weitere Abteilungen lassen sich in den Einstellungen anlegen.

## Drucker

| Feld | Typ | Hinweis |
|---|---|---|
| name | Text, eindeutig | |
| modell | Text | |
| verfahren | Auswahl | FDM, Resin |
| bauraumXMm, bauraumYMm, bauraumZMm | Zahl | für die Bauraum-Prüfung |
| duesenMm | Zahl | Standard-Düse |
| materialien | Liste | geeignete Materialien |
| anzahlMaterialien | Ganzzahl | gleichzeitig nutzbare Materialien/Farben (Werkzeugköpfe, AMS-Plätze) |
| zustand | Auswahl | Bereit, Wartung, Defekt, Außer Betrieb |
| standort | Text | |
| notizen | Langtext | |

**Startbestand** (weitere Drucker lassen sich in der Druckerverwaltung anlegen):

| Name | Verfahren | Bauraum (mm) | Materialien gleichzeitig |
|---|---|---|---|
| Prusa XL | FDM | 360 × 360 × 360 | 2 (zwei Werkzeugköpfe) |
| Bambu Lab P1S | FDM | 256 × 256 × 256 | 1 (mit AMS 4 – noch zu klären) |

## Druckjob

Ein geplanter oder gelaufener Druck auf genau einem Drucker. Ein Auftrag kann mehrere Jobs haben (mehrere Teile, Fehldrucke, Nachdrucke).

| Feld | Typ | Hinweis |
|---|---|---|
| auftragId | → Auftrag | |
| druckerId | → Drucker | |
| bezeichnung | Text | „Teil 2 von 3“ |
| startGeplant, endeGeplant | Zeitpunkt | Grundlage der Zeitleiste |
| startTatsaechlich, endeTatsaechlich | Zeitpunkt | |
| status | Auswahl | Geplant, Läuft, Erfolgreich, Fehlgeschlagen, Abgesagt |
| filamentG | Zahl | tatsächlicher Verbrauch |
| filamentId | → Filament | optional, späterer Ausbau |
| notiz | Text | z. B. Fehlerursache |

**Regel:** Zwei Jobs desselben Druckers dürfen sich zeitlich nicht überschneiden (Warnung, bewusst überstimmbar).

## Benutzer

| Feld | Typ | Hinweis |
|---|---|---|
| name | Text | |
| email | Text, eindeutig | Anmeldename |
| passwortHash | Text | niemals Klartext |
| rolle | Auswahl | Admin, Bearbeiter, Anforderer |
| abteilungId | → Abteilung | v. a. für Anforderer |
| aktiv | Ja/Nein | |

## Filament (späterer Ausbau)

| Feld | Typ | Hinweis |
|---|---|---|
| material, farbe, farbeHex, hersteller | Text | |
| spulengewichtG, restG | Zahl | |
| preisProKg | Zahl | für Kostenauswertung |

## Abgeleitete Werte

- Filament- und Druckzeitsummen pro Stück = Summe über dessen Aufträge.
- „Überfällig“ = `faelligAm` in der Vergangenheit und Status nicht Fertig/Geliefert/Abgebrochen.
