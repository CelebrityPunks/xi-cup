# Card Art Pipeline

Use generated sheets for consistency, then slice into reusable player-level or manager-level portrait assets.

## Why not one generated image per live roll?

Rolls are dynamic. The same player can appear in different random or curated stacks, and skipped stacks are burned per draft. If art is tied only to a generated five-card roll image, the same player becomes hard to reuse, inspect, animate, or show on the field.

Best flow:

1. Generate a portrait sheet for a curated deck, player range, or backlog batch.
2. Slice the sheet into individual portrait crops.
3. Save each crop under the player id.
4. Let the card renderer find the crop through its generated filename.

Example future manifest:

```json
{
  "playerId": 101,
  "name": "Samuel Eto'o",
  "portraitImage": "assets/players/player-101.png",
  "sourceSheet": "assets/sheets/inter-2010-sheet-01.png",
  "crop": { "x": 820, "y": 64, "w": 360, "h": 520 }
}
```

## Prompt shape

Use stylized, non-photoreal player portraits unless you have rights to use exact likenesses, club marks, and kit designs.

```txt
Use case: stylized-concept
Asset type: soccer draft card sheet
Primary request: Create a sheet of original fictional soccer player portraits for a fantasy draft game.
Style: cohesive, high-end sports trading-card art, painterly realism, dramatic stadium lighting, clean card borders, no real club logos, no official kit marks, no readable brand text.
Layout: exactly 5 columns by 5 rows, equal square cells, one centered portrait per cell.
Constraints: no real player likeness matching, no copyrighted logos, no watermarks, no random text.
Output target: source sheet that will be sliced into individual portrait assets.
```

## Slicing convention

For generated player sheets, keep a consistent canvas and grid:

- 5 portrait cells per row
- use 5x5 sheets for 25-player backlog ranges
- use 5x4 sheets for 20-player backlog ranges
- same portrait width and height for every sheet when possible
- no overlapping shadows between cards
- enough margin between cards for clean crops
- export crops to `assets/players/player-{id}.png`
- keep source sheets in `assets/sheets/`

Use the slicer script after copying a generated sheet into `assets/sheets/`:

```sh
node scripts/slice-player-sheet.js assets/sheets/players-sheet-006-030.png 6 25 5 5
node scripts/slice-player-sheet.js assets/sheets/players-sheet-181-200.png 181 20 5 4
```

The slicer skips existing player files by default. Add `--force` only when intentionally replacing crops.

For generated manager sheets:

- use a 4 column by 3 row sheet for the current 12 managers
- export crops to `assets/managers/manager-{id}.png`
- keep `assets/managers/manager-names.txt` as the source-of-truth order

## Implementation note

The app now checks generated portrait assets before falling back to CSS placeholders:

- players: `assets/players/player-{id}.png`, then name-based fallbacks
- managers: `assets/managers/manager-{id}.png`, then name-based fallbacks

Player ID assets should only be shown after a likeness QA pass. Keep the current verified list in:

- `assets/players/verified-player-images.json`
- `assets/players/verified-player-images.txt`

When replacing generic backlog portraits, generate a five-player sheet, slice with `--force`, then add the IDs to the verified list and `VERIFIED_PLAYER_IMAGE_IDS` in `app.js`. Unverified `player-{id}.png` files can remain in the asset folder as source history, but the app should not load them as final card portraits.

Use `assets/players/player-sheet-batches.txt` for the larger backlog sheets, or `assets/players/player-generation-batches.txt` when a five-player deck sheet is needed for more curated art.
