# Entscheidungen

Kurzes Protokoll der Grundsatzentscheidungen. Neue Einträge oben anfügen.

## Getroffen

### E-10 · Next.js ohne „Cache Components“ (13.10.2026)
In `next.config.ts` ist `cacheComponents` abgeschaltet. **Grund:** Jede Seite liegt hinter der Anmeldung und zeigt frische Daten aus der Datenbank; das neue Modell verlangt dafür in jeder Seite eigene Lade-Grenzen, ohne dass eine interne App mit wenigen Nutzern davon profitiert. **Zu beachten:** Laut Next.js-Dokumentation entfällt die Option in der nächsten Hauptversion – vor einem Versionssprung muss das neu bewertet werden.

### E-09 · Zunächst ohne Server (13.10.2026)
Entwickelt und genutzt wird vorerst lokal auf dem eigenen Rechner; der Code wird auf GitHub vorbereitet. Parallel läuft die Anfrage an die Haus-IT, ob ein interner Server möglich ist (O-1). **Grund:** Loslegen können, ohne auf die Server-Klärung zu warten – die Architektur ist für beide Wege gleich.

### E-08 · Code auf GitHub, Daten nicht (13.10.2026)
Der Quellcode liegt in einem privaten GitHub-Repository (Versionierung, Sicherung, Zugriff für den Kollegen). Datenbank und Bilder (`data/`) kommen nicht ins Repository. **Hinweis:** GitHub selbst kann die App nicht betreiben – GitHub Pages liefert nur statische Seiten ohne Datenbank und Bildspeicher. Wo die App läuft, ist O-1.

### E-07 · Notion wird abgelöst, nicht migriert (13.10.2026)
Die Notion-Datenbank „3D-Druck Aufträge · Opernhaus“ dient als Vorlage für Felder und Begriffe (Priorität „Mittel“, Status „Geliefert“, „Auftrag erhalten am“, Nummern `WB-n`), wird aber nicht importiert und danach nicht weitergeführt.

### E-06 · Abteilungen und Drucker sind pflegbare Listen (13.10.2026)
Start mit 9 Abteilungen und 2 Druckern (Prusa XL mit 2 Werkzeugköpfen, Bambu Lab P1S); beide Listen sind in der App erweiterbar. **Grund:** Es kommen absehbar weitere dazu.

### E-05 · Fachbegriffe auf Deutsch (13.10.2026)
Oberfläche deutsch; im Code deutsche Fachbegriffe ohne Umlaute (`stueck`, `auftrag`), Technik englisch. **Grund:** Die Begriffe entsprechen dem Theateralltag, Übersetzungen („play“, „order“) wären missverständlich.

### E-04 · Auftrag und Druckjob getrennt (13.10.2026)
Ein Auftrag beschreibt, *was* gebraucht wird; ein Druckjob, *wann auf welchem Drucker* gedruckt wird. **Grund:** Ein Auftrag besteht oft aus mehreren Teilen, Fehldrucken und Nachdrucken – nur so ist die Druckerplanung sauber möglich.

### E-03 · Bilder im Dateisystem, nicht in der Datenbank (13.10.2026)
**Grund:** Kleine Datenbank, einfaches Backup, Originale bleiben direkt zugreifbar.

### E-02 · SQLite statt Datenbankserver (13.10.2026)
**Grund:** Wenige Nutzer, eine Datei, kein Wartungsaufwand. Umstieg auf PostgreSQL über Prisma möglich, falls viele Abteilungen gleichzeitig arbeiten.

### E-01 · Eigene Web-App, selbst betrieben (13.10.2026)
Next.js-Anwendung auf einem Rechner im Haus statt Cloud-Dienst. **Grund:** Daten und Bilder bleiben im Haus, keine laufenden Kosten, keine Abstimmung zu externen Diensten nötig. Rollen sind von Anfang an vorgesehen, damit Kollege und Abteilungen später ohne Umbau dazukommen.

## Offen

| Nr. | Frage | Bis wann nötig |
|---|---|---|
| O-1 | **Betriebsort:** Läuft die App auf einem Rechner im Haus (nur im Haus-WLAN erreichbar, Daten bleiben intern) oder bei einem Hosting-Anbieter im Internet (von überall erreichbar, Daten und Fotos liegen extern)? WLAN im Haus ist vorhanden. Anfrage an die Haus-IT wegen eines internen Servers ist in Vorbereitung. | vor Phase 3 |
| O-2 | **Rechner** (falls im Haus): Arbeits-PC oder dauerhaft laufendes Gerät (Mini-PC, NAS)? | Phase 1, spätestens Phase 3 |
| O-3 | **Bambu Lab P1S:** Mit AMS (mehrere Farben) oder ohne? | Phase 2 |
| O-4 | **IT/Datenschutz:** Vorgaben des Hauses für eine Anwendung mit Benutzerkonten? | vor Phase 4, bei externem Hosting sofort |
