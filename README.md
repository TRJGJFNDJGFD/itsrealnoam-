# Legend-IL — Website + Live Network Status

```text
itsrealnoam- /
├── src/                          React + TypeScript + Vite + Tailwind + Framer Motion (the website)
├── api/v1/                       The status API — Vercel Functions, deployed as part of THIS SAME site
└── legendil-status-velocity/     Java Maven plugin for Velocity, reports live status
```

There is **one deployment**: this repo, pushed to Vercel. The website and the status API
ship together, on the same domain, from the same `vercel.json`. There's no separate
server, no separate hosting account, and no second URL to configure. Data flows one way:

```text
Minecraft servers
      ↓
   Velocity  (legendil-status-velocity plugin)
      ↓ HTTPS POST every 5s, Bearer-token authenticated
   Status API  (api/v1/heartbeat.ts, on this site)
      ↓ stored in Vercel's Runtime Cache
   Status API  (api/v1/status.ts, on this site)
      ↓ same-origin HTTPS GET, public, read-only
   Website  (/status page + homepage teaser card)
```

The browser never talks to Velocity directly. The Velocity API token lives only in
Vercel's environment variables (read by the `heartbeat` function) and is never present
in the website's bundle or in any GET response.

---

## 1. The website + status API (this repo)

```bash
npm install
npm run dev       # Vite dev server — the UI only; /api/v1/* won't exist here
npm run build     # production build -> dist/
npm run preview   # preview the production build
```

### Running the whole thing locally (website + functions together)

Plain `npm run dev` only starts Vite, so `/status` will show "Status Unavailable" — there's
no function server behind it. To run both together like Vercel does in production, use the
[Vercel CLI](https://vercel.com/docs/cli):

```bash
npm install -g vercel   # one-time
vercel link              # one-time, links this folder to your Vercel project
cp .env.example .env      # then fill in STATUS_API_TOKEN
vercel env pull .env.local  # or set env vars via `vercel dev`'s prompts
vercel dev
```

This serves the Vite app **and** `api/v1/*` on one local URL, with `/api/v1/*` routed to
the functions exactly like production.

### Where the live data is used

- `api/v1/heartbeat.ts` — Velocity posts here; validates and stores the payload in
  Vercel's Runtime Cache (`getCache()` from `@vercel/functions`).
- `api/v1/status.ts` — the website reads from here; applies the staleness check (see
  below) before ever calling the network "online".
- `src/lib/statusApi.ts` — the only place the frontend calls `fetch()`; always hits
  `/api/v1/status` on the same origin, no URL to configure.
- `src/lib/networkStatusStore.ts` — a small shared poller (5s interval) so every
  consumer (Hero's status widget, the homepage teaser card, and `/status`) reads from
  one in-flight request cycle instead of each running its own interval.
- `src/lib/useNetworkStatus.ts` — the hook every component uses
  (`useSyncExternalStore` under the hood).
- `src/components/ServerStatus.tsx`, `src/components/NetworkStatusTeaser.tsx`,
  `src/pages/Status.tsx` and `src/components/status/*` — the consuming UI.

**No mock data remains anywhere in this project.** Every number shown is either live
from the API or the UI explicitly says it doesn't have data ("Network Offline" /
"Status Unavailable" / "Checking…") rather than showing something fabricated.

### What's not shown (yet)

TPS, ping, CPU, RAM, uptime history, and a real player list all got removed from the
dashboard because Velocity can't currently supply them reliably (see "Future work" below)
— the UI simply doesn't claim to have data it doesn't have.

---

## 2. The status API (`api/v1/`)

Three Vercel Functions, deployed automatically whenever this repo deploys to Vercel —
no separate build, no separate host, no separate account:

- `GET /api/v1/health` → `{ "status": "ok" }`
- `POST /api/v1/heartbeat` — Velocity-only. Requires
  `Authorization: Bearer <STATUS_API_TOKEN>`. Wrong/missing token → `401`. Invalid
  payload shape → `400`.
- `GET /api/v1/status` — public, read-only. Returns:

  ```json
  {
    "network": "legend-il",
    "status": "online",
    "lastUpdated": "2026-09-16T12:00:05.000Z",
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

### Why this works without a server to manage

Functions are stateless — a fresh invocation doesn't remember the previous one — so the
latest heartbeat is stored in Vercel's **Runtime Cache** (`@vercel/functions`'
`getCache()`), a small key-value cache built into Vercel Functions themselves. No
database to provision, no separate service, no extra credentials, no dashboard step —
it's available automatically to every function on the Hobby plan. It's a *cache* (an
entry can be evicted before its TTL in rare cases), which is fine here: the staleness
check already treats "no recent heartbeat" as offline, so an evicted entry just looks
like a normal offline period rather than breaking anything.

### Environment variables (set these in Vercel's dashboard)

Go to your project → **Settings → Environment Variables**:

| Variable            | Meaning                                                                 |
|----------------------|--------------------------------------------------------------------------|
| `STATUS_API_TOKEN`   | Shared secret the Velocity plugin authenticates with. **Generate a real one**: `openssl rand -hex 32`. |
| `WEBSITE_ORIGIN`     | Optional. Only needed if some *other* site should also be allowed to read `GET /api/v1/status` from a browser — this site's own frontend is same-origin and doesn't need it. |
| `STALE_AFTER_MS`     | If no heartbeat arrives within this window, the network is reported offline instead of serving old numbers as live. Default `15000`. |

After adding/changing these, redeploy (Vercel's dashboard has a "Redeploy" button on the
latest deployment, or just push a commit) so the functions pick them up.

### Testing it end-to-end

Against your deployed site (replace with your real Vercel URL):

```bash
curl https://YOUR-SITE.vercel.app/api/v1/health
# {"status":"ok"}

curl -X POST https://YOUR-SITE.vercel.app/api/v1/heartbeat \
  -H "Authorization: Bearer YOUR_TOKEN" -H "Content-Type: application/json" \
  -d '{"network":"legend-il","timestamp":"2026-09-16T12:00:00Z","servers":[{"name":"lobby","status":"online","players":24,"maxPlayers":100}],"totalPlayers":24}'
# {"success":true}   (wrong token -> 401 Unauthorized)

curl https://YOUR-SITE.vercel.app/api/v1/status
# the JSON shape above, populated within a few seconds of the heartbeat
```

---

## 3. The Velocity plugin (`legendil-status-velocity/`)

Java, Maven, targets current Velocity (Java 21+). Reads Velocity's own live state —
nothing is hardcoded or invented.

### Build it

The `velocity-api` version pinned in `pom.xml` may drift out of date (Velocity mostly
ships `-SNAPSHOT` versions, which get superseded). If `mvn package` fails with
"was not found" for `velocity-api`, check the actual available versions at
https://repo.papermc.io/service/rest/repository/browse/maven-public/com/velocitypowered/velocity-api/
and update `<velocity.api.version>` in `pom.xml` to match the latest one listed before
rebuilding.

```bash
cd legendil-status-velocity
mvn package -U
# -U forces Maven to re-check for the dependency instead of reusing a cached
# "not found" result from an earlier attempt with a different version.
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

# Your Vercel site's heartbeat endpoint. Use the real https:// URL Vercel
# gives your site (or your custom domain, once you have one) — never a bare
# IP or http://, since this must be a valid HTTPS endpoint.
api-url=https://YOUR-SITE.vercel.app/api/v1/heartbeat

# Must match the STATUS_API_TOKEN set in Vercel's environment variables.
# Never commit this.
api-token=change-me

# How often (in seconds) to send a heartbeat.
heartbeat-interval=5
```

Restart the proxy after editing it. You should see a log line like:

```text
[legendil-status] Sending heartbeats for network 'legend-il' every 5s to https://YOUR-SITE.vercel.app/api/v1/heartbeat
```

Because the target is your Vercel site over HTTPS, this works with a managed game-panel
Minecraft host too — there's nothing to run alongside Velocity, no VPS, no tunnel. The
plugin just needs outbound HTTPS access, which a Minecraft host always allows.

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

1. Deploy this repo to Vercel (push to the branch Vercel builds from) and set
   `STATUS_API_TOKEN` in its environment variables.
2. `curl https://YOUR-SITE.vercel.app/api/v1/health` → `{"status":"ok"}`.
3. Build and install the Velocity plugin, point its `api-url` at
   `https://YOUR-SITE.vercel.app/api/v1/heartbeat` with your real token, restart the
   proxy, and watch its console for the "Sending heartbeats..." log line.
4. `curl https://YOUR-SITE.vercel.app/api/v1/status` — within 5 seconds you should see
   real player/server counts appear.
5. Open `https://YOUR-SITE.vercel.app/status` — the dashboard should match what curl
   showed you. No env var or redeploy needed on the website side — it's the same site.
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
- A 24h/7d/30d players-online graph (needs real persistent storage — e.g. Vercel
  Blob or a database — instead of just the latest cached heartbeat)
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
- `/staff` reads from `src/config/staff.ts` — fill in the real team there (username,
  optional Minecraft `uuid`). The page shows "Vacant" for empty ranks; no placeholder
  people are shown.
- The "Notify me" toggle on `/status` (`src/lib/useStatusNotifications.ts`) uses the
  browser's own Notification API — no server, email, or push service involved. It only
  fires while the tab is open and the opt-in is remembered per-browser via
  `localStorage`.
