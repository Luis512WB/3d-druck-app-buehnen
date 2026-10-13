# Sichert Datenbank und Bilder (Ordner data) mit Datum in einen Zielordner.
# Aufruf:  powershell -File scripts\backup.ps1 -Ziel "D:\Sicherung\3D-Druck"
param([Parameter(Mandatory = $true)][string]$Ziel)

$quelle = Join-Path (Split-Path $PSScriptRoot -Parent) "data"
$ordner = Join-Path $Ziel ("data_" + (Get-Date -Format "yyyy-MM-dd_HHmm"))

New-Item -ItemType Directory -Force $ordner | Out-Null
Copy-Item -Path (Join-Path $quelle "*") -Destination $ordner -Recurse -Force
Write-Output "Gesichert nach $ordner"
