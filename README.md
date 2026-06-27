# CrowdCue – Frontend

CrowdCue is a real-time song request app for DJs and their audience. The DJ creates a queue, shares a QR code with the crowd, and the audience can search for songs and add them to the playlist – all live and without registration.

## Features

- **DJ View** – Create a new queue and manage the current song list. Songs can be removed at any time.
- **Crowd View** – The audience opens the page via QR code or link, searches for songs and adds them to the queue.
- **QR Code Generator** – Automatically generated QR code that leads directly to the crowd view of the current queue. The link can also be copied to the clipboard.
- **Real-time Updates** – Queue changes (adding/removing songs) are instantly pushed to all connected clients via WebSocket (STOMP).

## Tech Stack

- **Framework:** [Angular 22](https://angular.dev/) with [Angular Material](https://material.angular.io/)
- **Real-time:** WebSockets via [@stomp/stompjs](https://stomp-js.github.io/stomp-websocket/)
- **QR Code:** [qrcode](https://www.npmjs.com/package/qrcode)
- **Tests:** [Vitest](https://vitest.dev/)

## Hosting

The app is built as a Docker image and hosted on [Railway](https://railway.app):

- **Production URL:** `https://crowdcue.xyz`
- **Build:** Multi-stage Dockerfile – Stage 1 builds the Angular app with Node.js, Stage 2 serves the static files via **nginx:alpine**.
- **Port:** 8080 (dynamically set by Railway via the `$PORT` environment variable)
- **Security:** nginx is configured with security headers (HSTS, CSP, X-Frame-Options, etc.)
- **Restart Policy:** The container is automatically restarted on failure (`ON_FAILURE`)

The backend runs as a separate service and provides the REST API and WebSocket endpoint.

## Local Development

### Prerequisites

- Node.js 22+
- npm 11+

### Setup

```bash
npm install
```

### Start Development Server

```bash
npm start
```

The app will be available at `http://localhost:4200`. Changes are automatically reloaded.

> For local development, the backend must be running at `http://localhost:8080` (see `src/environments/environment.ts`).

### Build

```bash
npm run build
```

Build artifacts are output to the `dist/` directory.

### Tests

```bash
npm test
```

### Docker (local)

```bash
docker build -t crowdcue-frontend .
docker run -e PORT=8080 -p 8080:8080 crowdcue-frontend
```
