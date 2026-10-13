# Anforderungen

## Ziel

3D-Druck-Aufträge für Theaterproduktionen an einem Ort erfassen, dokumentieren und planen – vom ersten Foto auf der Bühne bis zur Übergabe des fertigen Teils.

## Ausgangslage

Bisher werden Aufträge in der Notion-Datenbank „3D-Druck Aufträge · Opernhaus“ geführt (Projektname, Produktion, Abteilung, Ansprechpartner, Priorität, Status, erhalten am, Deadline, Material, Gramm, Druckzeit, Anzahl Teile, Notizen). Die App **ersetzt** diese Datenbank; die Felder sind übernommen und um Stücke als eigene Ebene, Bilder, Maße, Dateien und Druckerplanung erweitert. Die alten Einträge werden nicht migriert.

## Nutzergruppen

| Rolle | Wer | Ab wann | Darf |
|---|---|---|---|
| **Admin** | Luis | Phase 1 | Alles, inkl. Benutzer, Drucker, Abteilungen verwalten |
| **Bearbeiter** | Kollege, der viel druckt | Phase 3 | Stücke und Aufträge anlegen/bearbeiten, Drucke planen |
| **Anforderer** | Andere Abteilungen | Phase 4 | Aufträge anfragen, eigene Anfragen und deren Status sehen |

## Kernfunktionen

### 1. Stücke

- Stück anlegen, bearbeiten, archivieren (z. B. *Otello*).
- Angaben: Titel, Sparte, Spielzeit, Premiere, Spielstätte, Ansprechpersonen, Notizen, Titelbild.
- Stückseite zeigt alle zugehörigen Aufträge mit Status sowie Summen (Anzahl, Filamentverbrauch, Druckzeit).
- Aufträge ohne Stück sind möglich (z. B. Werkstattbedarf, Ersatzteile) – als „Allgemein“.

### 2. Aufträge

- Auftrag gehört zu einem Stück und zu einer Abteilung.
- Angaben: Titel, Beschreibung, Abteilung, Ansprechperson, **Priorität**, **Status**, Termin (fällig bis), Stückzahl, Material, **Farbe**, **Filamentmenge** (geschätzt und tatsächlich), Druckzeit (geschätzt und tatsächlich), Nachbearbeitung (z. B. schleifen, lackieren).
- **Maße:** Hauptmaße L × B × H sowie beliebig viele benannte Einzelmaße („Durchmesser Rohr: 42 mm“).
- **Bilder:** direkt mit der Handykamera aufnehmen oder aus der Galerie/vom PC hochladen, mit Beschriftung.
- **Notizen:** Verlauf mit Datum und Autor, schnell ergänzbar.
- **Dateien:** CAD- und Slicer-Dateien anhängen (STEP, F3D, STL, 3MF, G-Code).
- Auftrag duplizieren (gleiche Teile für ein anderes Stück oder Nachdruck).

- Umfang: „Nur Druck“ oder „Konstruktion + Druck“.
- Abteilungen sind eine pflegbare Liste (Start: Beleuchtung, Technik, Schreinerei, Schlosserei, Deko, Requisite, Maske, Schneiderei, Ton); neue lassen sich jederzeit anlegen.

**Prioritäten:** Niedrig · Mittel · Hoch · Dringend

**Status:** Angefragt → In Planung → Konstruktion → Druckbereit → Im Druck → Nachbearbeitung → Fertig → Geliefert (zusätzlich: Pausiert, Abgebrochen)

### 3. Erfassen am Handy

- Neuer Auftrag in wenigen Schritten; nur Titel und Stück sind Pflicht, alles andere kann später ergänzt werden.
- Foto aufnehmen direkt aus dem Formular.
- Zahleneingabe für Maße mit Zifferntastatur.
- Als Symbol auf dem Startbildschirm ablegbar (PWA).

### 4. Öffnen am PC zur Konstruktion

- Auftragsseite mit großen Bildern (Vollbild, Zoom) und Maßtabelle nebeneinander.
- Alle Bilder und Dateien eines Auftrags als ZIP herunterladen.
- Maße in die Zwischenablage kopieren.
- Druckbare Auftragsübersicht (PDF über den Browser).

### 5. Übersicht und Suche

- Startseite: offene Aufträge nach Priorität und Termin, was läuft gerade auf welchem Drucker, was ist als Nächstes fällig.
- Auftragsliste mit Filtern (Stück, Abteilung, Status, Priorität, Material, Farbe) und Volltextsuche.
- Darstellung als Liste und als Board (Spalten nach Status).

### 6. Druckerplanung (Phase 2)

- Drucker verwalten: Name, Modell, Bauraum, Verfahren, Düse, geeignete Materialien, Zustand (Bereit, Wartung, Defekt).
- Auftrag in einen oder mehrere **Druckjobs** aufteilen und je Job Drucker, Start und Dauer festlegen.
- Zeitleiste pro Drucker (Tag/Woche) mit Erkennung von Überschneidungen.
- Hinweis, wenn Maße den Bauraum überschreiten oder das Material nicht zum Drucker passt.
- Ergebnis je Job: Erfolgreich / Fehlgeschlagen, tatsächlicher Verbrauch und Dauer.

### 7. Anfragen aus Abteilungen (Phase 4)

- Vereinfachtes Formular: Was wird gebraucht, für welches Stück, bis wann, Bilder/Skizzen.
- Anfrage landet mit Status „Angefragt“ und wird von Admin/Bearbeiter angenommen, rückgefragt oder abgelehnt.
- Anforderer sehen den Status ihrer eigenen Anfragen.

## Spätere Ideen

- Filamentlager (Spulen, Restmengen, Verbrauch automatisch abbuchen).
- Auswertung pro Stück und Spielzeit (Verbrauch, Druckstunden, Materialkosten).
- Export als CSV/PDF.
- Benachrichtigungen (E-Mail) bei neuer Anfrage oder Statuswechsel.

## Nicht-funktionale Anforderungen

- **Geräte:** Handy (ab 375 px) und Desktop gleichwertig bedienbar.
- **Sprache:** Deutsch.
- **Einfachheit:** Schlichte, moderne Oberfläche; häufige Aktionen mit wenigen Klicks.
- **Datenhoheit:** Daten liegen zunächst auf einem eigenen Rechner im Haus, keine Cloud-Pflicht.
- **Sicherung:** Regelmäßiges, einfaches Backup von Datenbank und Bildern.
- **Zugriff:** Anmeldung erforderlich, sobald die App im Netzwerk erreichbar ist.
- **Bilder:** Große Handyfotos werden verkleinert angezeigt, das Original bleibt abrufbar.

## Abgrenzung

Die App steuert keine Drucker, slict nicht und ersetzt kein CAD-Programm. Sie dokumentiert und plant.
