# Roadmap

Jede Phase ergibt eine für sich nutzbare App. Spätere Phasen sind im Datenmodell schon vorbereitet, werden aber erst gebaut, wenn sie dran sind.

## Phase 0 – Grundgerüst (erledigt)

- [x] Next.js-Projekt mit TypeScript und Tailwind anlegen, Git einrichten, `.gitignore` (inkl. `data/`)
- [x] Privates GitHub-Repository für den Code
- [x] Prisma + SQLite, erstes Schema, Seed (9 Abteilungen, Prusa XL, Bambu Lab P1S, Admin-Benutzer)
- [x] Grundlayout: Navigation mobil/Desktop, Hell/Dunkel, Basis-Komponenten
- [x] Anmeldung (ein Admin)

## Phase 1 – Stücke und Aufträge (MVP)

- [x] Stücke: anlegen, bearbeiten, archivieren, Detailseite
- [x] Aufträge: anlegen, bearbeiten, duplizieren; Abteilung, Priorität, Status, Termin, Material, Farbe, Filamentmenge
- [x] Maße: Hauptmaße und Einzelmaße
- [x] Bilder: Upload/Kamera, Vorschaubilder, Galerie mit Vollbild
- [x] Notizen-Verlauf
- [x] Auftragsliste mit Filtern und Suche
- [ ] Board-Ansicht nach Status
- [x] Startseite mit offenen und fälligen Aufträgen
- [x] Desktop-Ansicht für die Konstruktion, ZIP-Download
- [ ] Eigene Druckansicht (PDF)
- [ ] Automatische Tests
- [x] PWA-Manifest, Backup-Skript (`scripts/backup.ps1`), Start per Doppelklick (`Starten.bat`)

**Ziel:** *Otello* anlegen, auf der Bühne einen Auftrag mit Fotos und Maßen erfassen, am Rechner zur Konstruktion öffnen.

## Phase 1b – Maßbibliothek

- [x] Einträge mit Kategorie, Maßtabelle (Varianten), Bildern, Dateien, Quelle, Druckhinweis
- [x] Kategorien anlegen, Suche
- [x] Maße aus der Bibliothek in einen Auftrag übernehmen

**Ziel:** Maße einer Kabelverschraubung oder eines DMX-Einbauausschnitts einmal sauber hinterlegen und bei jedem Auftrag wiederverwenden.

## Phase 2 – Druckerplanung

- [ ] Druckerverwaltung (Bauraum, Materialien, Zustand)
- [ ] Druckjobs je Auftrag, Zeitleiste pro Drucker
- [ ] Warnung bei Überschneidung, Bauraum und Material
- [ ] Job-Ergebnis und tatsächlicher Verbrauch, Summen je Auftrag/Stück
- [ ] „Läuft gerade“ auf der Startseite

## Phase 3 – Zweiter Nutzer

- [ ] Benutzerverwaltung, Rolle Bearbeiter
- [ ] Zuweisung von Aufträgen, „Meine Aufträge“
- [ ] Automatische Verlaufseinträge (wer hat wann was geändert)
- [ ] Umzug auf dauerhaft laufenden Rechner/Server, HTTPS

## Phase 4 – Anfragen aus Abteilungen

- [ ] Rolle Anforderer, vereinfachtes Anfrageformular
- [ ] Eingang: annehmen, rückfragen, ablehnen
- [ ] Statusansicht für Anforderer
- [ ] Benachrichtigungen per E-Mail

## Phase 5 – Ausbau

- [ ] Filamentlager mit Restmengen
- [ ] Auswertungen pro Stück/Spielzeit (Verbrauch, Druckstunden, Kosten)
- [ ] CSV-/PDF-Export
