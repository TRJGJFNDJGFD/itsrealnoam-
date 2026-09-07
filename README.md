# Legend-IL — Website + Live Network Status

This repository contains three separate projects:

```text
itsrealnoam- /                    (this repo root — the website)
├── src/                          React + TypeScript + Vite + Tailwind + Framer Motion
├── legendil-status-api/          Node.js + TypeScript + Fastify — the Status API
└── legendil-status-velocity/     Java Maven plugin for Velocity 3.x
```

They're independently deployable. The data only ever flows one way:

```text
Minecraft servers
      ↓
   Velocity  (legendil-status-velocity plugin)
      ↓ HTTPS POST every 5s, Bearer-token authenticated
   Status API  (legendil-status-api)
      ↓ HTTPS GET, public, read-only
   Website  (/status page + homepage teaser card)
```

The browser never talks to Velocity directly. The Velocity API token lives only on the
plugin side and is never present in the website's bundle.

---

## 1. The website (this directory)

```bash
npm install
npm run dev       # local dev server
npm run build     # production build -> dist/
npm run preview   # preview the production build
```

### Connecting it to the Status API

Copy `.env.example` to `.env` and set:

```env
VITE_STATUS_API_URL=http://localhost:3001
```

This is a **public** URL, not a secret — it's baked into the client bundle so the browser
knows where to `fetch()` from. Point it at your deployed API's origin in production
(e.g. `https://status-api.legend-il.net`).

If this variable isn't set, the site still builds and runs fine — `/status` and the
homepage card just show "Status Unavailable" instead of throwing.

### Where the live data is used

- `src/lib/statusApi.ts` — the only place that calls `fetch()` against the Status API.
- `src/lib/networkStatusStore.ts` — a small shared poller (5s interval) so every
  consumer (Hero's status widget, the homepage teaser card, and `/status`) reads from
  one in-flight request cycle instead of each running its own interval.
- `src/lib/useNetworkStatus.ts` — the hook every component actually uses
  (`useSyncExternalStore` under the hood).
- `src/components/ServerStatus.tsx` — the small status line in the Hero section.
- `src/components/NetworkStatusTeaser.tsx` — the compact "Legend-IL Network" card on
  the homepage, linking to `/status`.
- `src/pages/Status.tsx` and `src/components/status/*` — the full dashboard.

**No mock data remains anywhere in this project.** Every number shown is either live
from the API or the UI explicitly says it doesn't have data ("Network Offline" /
"Status Unavailable" / "Checking…") rather than showing something fabricated.

### What's not shown (yet)

TPS, ping, CPU, RAM, uptime history, and a real player list all got removed from the
dashboard because Velocity can't currently supply them reliably (see the "Future work"
section below) — the UI simply doesn't claim to have data it doesn't have.

---

## 2. The Status API (`legendil-status-api/`)

Fastify + TypeScript. Holds the latest heartbeat in memory and serves it back out.

### Run it

```bash
cd legendil-status-api
npm install
cp .env.example .env    # then edit STATUS_API_TOKEN and WEBSITE_ORIGIN
npm run dev              # tsx watch, for local development
# or:
npm run build && npm run start   # production
```

### Environment variables

| Variable            | Meaning                                                                 |
|----------------------|--------------------------------------------------------------------------|
| `PORT`               | Port to listen on (default `3001`).                                     |
| `STATUS_API_TOKEN`   | Shared secret the Velocity plugin authenticates with. **Generate a real one**: `openssl rand -hex 32`. |
| `WEBSITE_ORIGIN`     | Comma-separated list of origins allowed to call `GET /api/v1/status` from a browser. Never `*` in production. |
| `STALE_AFTER_MS`     | If no heartbeat arrives within this window, the network is reported offline instead of serving old numbers as live. Default `15000`. |

### Endpoints

- `GET /api/v1/health` → `{ "status": "ok" }`
- `POST /api/v1/heartbeat` — Velocity-only. Requires `Authorization: Bearer <STATUS_API_TOKEN>`.
  Wrong or missing token → `401 Unauthorized`. Invalid payload shape → `400`. Rate-limited
  to 20 requests/minute (heartbeats are expected every 5s).
- `GET /api/v1/status` — public, read-only, CORS-restricted to `WEBSITE_ORIGIN`. Returns:

  ```json
  {
    "network": "legend-il",
    "status": "online",
    "lastUpdated": "2026-09-07T12:00:05.000Z",
    "totalPlayers": 91,
    "serversOnline": 2,
    "serversTotal": 3,
    "servers": [
      { "name": "lobby", "status": "online", "players": 24, "maxPlayers": 100 }
    ]
  }
  ```

  When stale (no heartbeat within `STALE_AFTER_MS`), `status` becomes `"offline"` and
  `totalPlayers` / `serversOnline` / `serversTotal` / `servers` are nulled out rather
  than serving the last known numbers as if they were current.

### Testing it end-to-end

```bash
curl http://localhost:3001/api/v1/health
# {"status":"ok"}

curl -X POST http://localhost:3001/api/v1/heartbeat \
  -H "Authorization: Bearer YOUR_TOKEN" -H "Content-Type: application/json" \
  -d '{"network":"legend-il","timestamp":"2026-09-07T12:00:00Z","servers":[{"name":"lobby","status":"online","players":24,"maxPlayers":100}],"totalPlayers":24}'
# {"success":true}   (wrong token -> 401 Unauthorized)

curl http://localhost:3001/api/v1/status
# the JSON shape above
```

### Deployment note

This process holds state in memory, so it needs a **persistent runtime** — a small VPS,
Railway, Render, Fly.io, etc. — not a stateless serverless function platform (a fresh
serverless invocation wouldn't remember the last heartbeat). Put it behind HTTPS
(a reverse proxy like Caddy/Nginx with a Let's Encrypt cert, or your host's built-in TLS)
before pointing Velocity at it — the plugin's `api-url` should be an `https://` address in
production.

---

## 3. The Velocity plugin (`legendil-status-velocity/`)

Java, Maven, targets Velocity 3.x (Java 17+). Reads Velocity's own live state — nothing
is hardcoded or invented.

### Build it

```bash
cd legendil-status-velocity
mvn package
# -> target/legendil-status-1.0.0.jar
```

Drop that jar into your Velocity proxy's `plugins/` folder and restart the proxy.

### Configure it

On first boot with no config present, the plugin writes a template to
`plugins/legendil-status/config.properties` and stays disabled (logging a warning) until
you fill it in:

```properties
# The network name reported in every heartbeat payload.
network=legend-il

# Full URL of your Status API's heartbeat endpoint.
api-url=https://YOUR-API-DOMAIN/api/v1/heartbeat

# Shared secret configured on the Status API side (STATUS_API_TOKEN). Never commit this.
api-token=change-me

# How often (in seconds) to send a heartbeat.
heartbeat-interval=5
```

Restart the proxy after editing it. You should see a log line like:

```text
[legendil-status] Sending heartbeats for network 'legend-il' every 5s to https://YOUR-API-DOMAIN/api/v1/heartbeat
```

### What it actually sends

Every `heartbeat-interval` seconds, for every server registered in Velocity's own
configuration (`velocity.toml`'s `[servers]` table — nothing is hardcoded in the plugin),
it:

1. Pings the backend server (`RegisteredServer.ping()`) to find out if it's really
   reachable, not just "has anyone currently connected through us" — a server with 0
   players still needs to report online if it responds.
2. Reads the real online/max player counts from that ping (falling back to the
   proxy's own connected-player count if the ping doesn't include player info).
3. Reads the proxy-wide total player count from `ProxyServer.getPlayerCount()`.
4. POSTs the result as JSON with `Authorization: Bearer <api-token>`.

It intentionally does **not** send a player list, per-player usernames, IPs, UUIDs, or
ping times in this version — see "Future work" below for how to add that later without
breaking the API contract.

---

## Verifying the whole pipeline works

1. Start the Status API (`npm run dev` in `legendil-status-api/`).
2. `curl http://localhost:3001/api/v1/health` → `{"status":"ok"}`.
3. Build and install the Velocity plugin, point its `api-url` at
   `http://YOUR-VELOCITY-HOST:3001/api/v1/heartbeat` (use your real API token), restart
   the proxy, and watch its console for the "Sending heartbeats..." log line.
4. `curl http://localhost:3001/api/v1/status` — within 5 seconds you should see real
   player/server counts appear.
5. Set `VITE_STATUS_API_URL` in the website's `.env` to the API's URL, run `npm run dev`,
   and open `/status` — the dashboard should match what curl showed you.
6. Stop the proxy (or just wait): after 15 seconds with no heartbeat, both the API and
   the website should report the network offline rather than showing stale numbers.

---

## Future work (designed for, not built yet)

The API and plugin's payload shapes were kept deliberately minimal and additive so none
of the following require breaking changes — just new optional fields plus new UI to
show them:

- TPS / MSPT / CPU / RAM per server
- Real per-server ping
- A real online-player list (with usernames only — still no IPs/UUIDs)
- Player join/leave/session history
- A 24h/7d/30d players-online graph (needs the API to persist history somewhere instead
  of holding only the latest heartbeat)
- Maintenance mode / incident banners
- Multiple Velocity proxies reporting into the same API

None of these are shown on the site today because there's no real source for them yet —
adding fake numbers back in would violate the whole point of this rework.

---

## Notes

- Not affiliated with Mojang or Microsoft.
- The website's own animation/design system, Discord/Vote integration, and page routing
  are documented inline in `src/` — see `src/lib/router.ts` for the tiny client-side
  router and `src/config/site.ts` for the single source of truth on the server IP,
  Discord invite, and vote link.
