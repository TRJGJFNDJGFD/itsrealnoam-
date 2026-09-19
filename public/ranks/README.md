# Rank badges

A complete, consistent badge set for every rank in the network — one shared
visual system (frame, glow, typography), with a color and ornamentation
tier per rank so higher ranks read as visibly more prestigious.

- `svg/` — vector source, transparent background, font embedded (portable,
  edit these).
- `png/` — rasterized exports, transparent background, ~2200×900px
  (@3x), ready to drop into the website, Discord, TAB/scoreboard textures,
  or any menu.

## Ranks

Founder, Owner, Co-Owner, Staff Manager, Manager, Admin, S-Developer,
S-Configuring, S-Builder, Developer, Configuring, Builder, Mod, Helper,
Media, Friend, LegendMaster, LegendPro, Legend, MVP, VIP.

## Regenerating

The set is generated from `scripts/rank-badges/generate.mjs` (rank colors,
frame tier, and name all live there) and rasterized with
`scripts/rank-badges/render.mjs`.

```bash
npm run badges:generate   # writes public/ranks/svg/*.svg
npm run badges:render     # writes public/ranks/png/*.png (needs Chromium)
```

Edit a rank's colors, its frame tier (`crown` / `royal` / `elite` /
`standard` — controls glow strength, border weight, and corner
ornamentation), or add a new rank in the `RANKS` array, then re-run both
commands.
