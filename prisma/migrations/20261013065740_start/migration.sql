-- CreateTable
CREATE TABLE "Benutzer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwortHash" TEXT NOT NULL,
    "rolle" TEXT NOT NULL DEFAULT 'BEARBEITER',
    "aktiv" BOOLEAN NOT NULL DEFAULT true,
    "abteilungId" INTEGER,
    "erstelltAm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "geaendertAm" DATETIME NOT NULL,
    CONSTRAINT "Benutzer_abteilungId_fkey" FOREIGN KEY ("abteilungId") REFERENCES "Abteilung" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Abteilung" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "farbeHex" TEXT,
    "aktiv" BOOLEAN NOT NULL DEFAULT true,
    "erstelltAm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "geaendertAm" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Stueck" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titel" TEXT NOT NULL,
    "sparte" TEXT,
    "spielzeit" TEXT,
    "premiere" DATETIME,
    "spielstaette" TEXT,
    "ansprechpersonen" TEXT,
    "notizen" TEXT,
    "status" TEXT NOT NULL DEFAULT 'AKTIV',
    "titelbildId" INTEGER,
    "erstelltAm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "geaendertAm" DATETIME NOT NULL,
    CONSTRAINT "Stueck_titelbildId_fkey" FOREIGN KEY ("titelbildId") REFERENCES "Anhang" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Auftrag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nummer" TEXT NOT NULL,
    "titel" TEXT NOT NULL,
    "beschreibung" TEXT,
    "stueckId" INTEGER,
    "abteilungId" INTEGER,
    "ansprechperson" TEXT,
    "umfang" TEXT NOT NULL DEFAULT 'KONSTRUKTION_UND_DRUCK',
    "prioritaet" TEXT NOT NULL DEFAULT 'MITTEL',
    "status" TEXT NOT NULL DEFAULT 'ANGEFRAGT',
    "erhaltenAm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "faelligAm" DATETIME,
    "stueckzahl" INTEGER NOT NULL DEFAULT 1,
    "material" TEXT,
    "farbe" TEXT,
    "farbeHex" TEXT,
    "filamentGeschaetztG" REAL,
    "filamentTatsaechlichG" REAL,
    "druckzeitGeschaetztMin" INTEGER,
    "druckzeitTatsaechlichMin" INTEGER,
    "laengeMm" REAL,
    "breiteMm" REAL,
    "hoeheMm" REAL,
    "nachbearbeitung" TEXT,
    "erstelltVonId" INTEGER,
    "zugewiesenAnId" INTEGER,
    "abgeschlossenAm" DATETIME,
    "erstelltAm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "geaendertAm" DATETIME NOT NULL,
    CONSTRAINT "Auftrag_stueckId_fkey" FOREIGN KEY ("stueckId") REFERENCES "Stueck" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Auftrag_abteilungId_fkey" FOREIGN KEY ("abteilungId") REFERENCES "Abteilung" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Auftrag_erstelltVonId_fkey" FOREIGN KEY ("erstelltVonId") REFERENCES "Benutzer" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Auftrag_zugewiesenAnId_fkey" FOREIGN KEY ("zugewiesenAnId") REFERENCES "Benutzer" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Mass" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "auftragId" INTEGER,
    "bibliothekseintragId" INTEGER,
    "variante" TEXT,
    "geprueft" BOOLEAN NOT NULL DEFAULT false,
    "bezeichnung" TEXT NOT NULL,
    "wert" REAL NOT NULL,
    "einheit" TEXT NOT NULL DEFAULT 'mm',
    "notiz" TEXT,
    "reihenfolge" INTEGER NOT NULL DEFAULT 0,
    "erstelltAm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "geaendertAm" DATETIME NOT NULL,
    CONSTRAINT "Mass_auftragId_fkey" FOREIGN KEY ("auftragId") REFERENCES "Auftrag" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Mass_bibliothekseintragId_fkey" FOREIGN KEY ("bibliothekseintragId") REFERENCES "Bibliothekseintrag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Anhang" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "auftragId" INTEGER,
    "stueckId" INTEGER,
    "bibliothekseintragId" INTEGER,
    "art" TEXT NOT NULL DEFAULT 'BILD',
    "dateiname" TEXT NOT NULL,
    "pfad" TEXT NOT NULL,
    "vorschauPfad" TEXT,
    "mimeTyp" TEXT NOT NULL,
    "groesseBytes" INTEGER NOT NULL,
    "beschriftung" TEXT,
    "hochgeladenVonId" INTEGER,
    "erstelltAm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "geaendertAm" DATETIME NOT NULL,
    CONSTRAINT "Anhang_auftragId_fkey" FOREIGN KEY ("auftragId") REFERENCES "Auftrag" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Anhang_stueckId_fkey" FOREIGN KEY ("stueckId") REFERENCES "Stueck" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Anhang_bibliothekseintragId_fkey" FOREIGN KEY ("bibliothekseintragId") REFERENCES "Bibliothekseintrag" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Anhang_hochgeladenVonId_fkey" FOREIGN KEY ("hochgeladenVonId") REFERENCES "Benutzer" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Notiz" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "auftragId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "art" TEXT NOT NULL DEFAULT 'NOTIZ',
    "autorId" INTEGER,
    "erstelltAm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "geaendertAm" DATETIME NOT NULL,
    CONSTRAINT "Notiz_auftragId_fkey" FOREIGN KEY ("auftragId") REFERENCES "Auftrag" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Notiz_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "Benutzer" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Drucker" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "modell" TEXT,
    "verfahren" TEXT NOT NULL DEFAULT 'FDM',
    "bauraumXMm" REAL,
    "bauraumYMm" REAL,
    "bauraumZMm" REAL,
    "duesenMm" REAL,
    "materialien" TEXT,
    "anzahlMaterialien" INTEGER NOT NULL DEFAULT 1,
    "zustand" TEXT NOT NULL DEFAULT 'BEREIT',
    "standort" TEXT,
    "notizen" TEXT,
    "erstelltAm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "geaendertAm" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Druckjob" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "auftragId" INTEGER NOT NULL,
    "druckerId" INTEGER NOT NULL,
    "bezeichnung" TEXT,
    "startGeplant" DATETIME,
    "endeGeplant" DATETIME,
    "startTatsaechlich" DATETIME,
    "endeTatsaechlich" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'GEPLANT',
    "filamentG" REAL,
    "notiz" TEXT,
    "erstelltAm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "geaendertAm" DATETIME NOT NULL,
    CONSTRAINT "Druckjob_auftragId_fkey" FOREIGN KEY ("auftragId") REFERENCES "Auftrag" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Druckjob_druckerId_fkey" FOREIGN KEY ("druckerId") REFERENCES "Drucker" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Bibliothekskategorie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "reihenfolge" INTEGER NOT NULL DEFAULT 0,
    "erstelltAm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "geaendertAm" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Bibliothekseintrag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titel" TEXT NOT NULL,
    "kategorieId" INTEGER,
    "beschreibung" TEXT,
    "druckhinweis" TEXT,
    "quelle" TEXT,
    "schlagworte" TEXT,
    "erstelltVonId" INTEGER,
    "erstelltAm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "geaendertAm" DATETIME NOT NULL,
    CONSTRAINT "Bibliothekseintrag_kategorieId_fkey" FOREIGN KEY ("kategorieId") REFERENCES "Bibliothekskategorie" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Bibliothekseintrag_erstelltVonId_fkey" FOREIGN KEY ("erstelltVonId") REFERENCES "Benutzer" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Benutzer_email_key" ON "Benutzer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Abteilung_name_key" ON "Abteilung"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Stueck_titelbildId_key" ON "Stueck"("titelbildId");

-- CreateIndex
CREATE UNIQUE INDEX "Auftrag_nummer_key" ON "Auftrag"("nummer");

-- CreateIndex
CREATE INDEX "Auftrag_status_idx" ON "Auftrag"("status");

-- CreateIndex
CREATE INDEX "Auftrag_stueckId_idx" ON "Auftrag"("stueckId");

-- CreateIndex
CREATE UNIQUE INDEX "Drucker_name_key" ON "Drucker"("name");

-- CreateIndex
CREATE INDEX "Druckjob_druckerId_startGeplant_idx" ON "Druckjob"("druckerId", "startGeplant");

-- CreateIndex
CREATE UNIQUE INDEX "Bibliothekskategorie_name_key" ON "Bibliothekskategorie"("name");
