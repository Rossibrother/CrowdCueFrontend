# CrowdCue – Frontend

CrowdCue ist eine Echtzeit-Song-Request-App für DJs und ihr Publikum. Der DJ erstellt eine Queue, teilt einen QR-Code mit dem Publikum und das Publikum kann darüber Songs suchen und zur Playlist hinzufügen – alles live und ohne Registrierung.

## Features

- **DJ-View** – Erstelle eine neue Queue und verwalte die aktuelle Songliste. Songs können jederzeit entfernt werden.
- **Crowd-View** – Das Publikum öffnet die Seite per QR-Code oder Link, sucht nach Songs und fügt sie der Queue hinzu.
- **QR-Code-Generator** – Automatisch generierter QR-Code, der direkt zur Crowd-View der aktuellen Queue führt. Der Link kann auch in die Zwischenablage kopiert werden.
- **Echtzeit-Updates** – Queue-Änderungen (Songs hinzufügen/entfernen) werden per WebSocket (STOMP) sofort an alle verbundenen Clients übertragen.

## Tech Stack

- **Framework:** [Angular 22](https://angular.dev/) mit [Angular Material](https://material.angular.io/)
- **Echtzeit:** WebSockets via [@stomp/stompjs](https://stomp-js.github.io/stomp-websocket/)
- **QR-Code:** [qrcode](https://www.npmjs.com/package/qrcode)
- **Tests:** [Vitest](https://vitest.dev/)

## Hosting

Die App ist als Docker-Image gebaut und wird auf [Railway](https://railway.app) gehostet:

- **Produktions-URL:** `https://crowdcue.xyz`
- **Build:** Multi-Stage Dockerfile – Stage 1 baut die Angular-App mit Node.js, Stage 2 liefert die statischen Dateien über **nginx:alpine** aus.
- **Port:** 8080 (wird von Railway dynamisch über die `$PORT`-Umgebungsvariable gesetzt)
- **Sicherheit:** nginx ist mit Security-Headern konfiguriert (HSTS, CSP, X-Frame-Options, etc.)
- **Restart-Policy:** Bei Fehler wird der Container automatisch neu gestartet (`ON_FAILURE`)

Das Backend läuft als separater Service und stellt die REST-API sowie den WebSocket-Endpunkt bereit.

## Lokale Entwicklung

### Voraussetzungen

- Node.js 22+
- npm 11+

### Setup

```bash
npm install
```

### Entwicklungsserver starten

```bash
npm start
```

Die App ist dann unter `http://localhost:4200` erreichbar. Änderungen werden automatisch neu geladen.

> Für lokale Entwicklung muss das Backend auf `http://localhost:8080` laufen (siehe `src/environments/environment.ts`).

### Build

```bash
npm run build
```

Die Build-Artefakte landen im `dist/`-Verzeichnis.

### Tests

```bash
npm test
```

### Docker (lokal)

```bash
docker build -t crowdcue-frontend .
docker run -e PORT=8080 -p 8080:8080 crowdcue-frontend
```
