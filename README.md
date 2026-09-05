# Legend-IL — Official Website

A landing page for the Legend-IL Minecraft network, built on the same architecture as Pixel-IL: React + TypeScript + Vite + Tailwind CSS v4 + Framer Motion + Lucide.

## Run it

```bash
npm install
npm run dev       # local dev server
npm run build      # production build -> dist/
npm run preview    # preview the production build
```

## One thing left to fill in

**The next game mode** — SkyMines and Lifesteal are wired in with real names/descriptions in `GAMES` (`src/config/site.ts`). The third slot in the games grid is `ComingSoonCard.tsx` (links to Discord, "more modes coming soon"). Once you have the next mode, add it to the `GAMES` array and swap `<ComingSoonCard />` for a real `<GameCard game={...} />` in `GamesSection.tsx`.

Discord invite is already live (`SITE_CONFIG.discord` in `src/config/site.ts`) — every "JOIN DISCORD" button on the site reads from that one value.

## What's different from Pixel-IL

- **Accent color**: gold/amber (`#E8B84F`, dark `#B8862A`, soft `#F3D68C`) instead of cyan — a deliberate choice so the two sibling sites read as distinct brands rather than reskins of each other, and it fits the "legendary" name. SkyMines uses this gold accent; Lifesteal keeps the same restrained red as Pixel-IL's.
- **Two confirmed modes, one placeholder** — the games grid is SkyMines (featured, full-width) + Lifesteal + a "coming soon" card, instead of three confirmed modes.
- **No VOTE nav link yet** — Pixel-IL's nav has one; Legend-IL's doesn't, since there's no listing URL yet. Add a `vote` value to `SITE_CONFIG` and re-add the nav entry (see how `Navbar.tsx`/`site.ts` do it in the Pixel-IL project) once you have one.
- **Live server status** already wired to the real IP (`legend-il.net`) via `src/lib/useServerStatus.ts` (mcsrvstat.us, no API key needed).
- Same font system (MinecraftSeven, falling back to Silkscreen), same "How to Join" Java/Bedrock guide, same generative `PixelScene` artwork system, same hairline-divider design language.

## Where things live

- `src/config/site.ts` — server IP, Discord invite, description, and the `serverStatus` fallback.
- `src/lib/useServerStatus.ts` — live status polling (mcsrvstat.us, 60s refresh).
- `src/components/PixelScene.tsx` — the generative artwork system, reused as-is.
- `src/components/PixelMark.tsx` — the badge logo mark, now drawing an "L" instead of Pixel-IL's "P".

## Notes

- Not affiliated with Mojang or Microsoft.
