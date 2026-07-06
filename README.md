# XI Cup

XI Cup is a browser-based soccer fantasy draft game: build an all-time starting XI from limited player packs, optimize chemistry, and simulate cup runs — solo or 1v1 with friends.

This repo is a dependency-free MVP based on the product requirements doc.

## Run

Open `index.html` in a browser.

No install step is required. The solo prototype stores state in browser `localStorage`.

## Built in this MVP

- five-player draft stacks
- curated and random pack rolls
- viewed stack burn/discard logic
- two free rerolls and capped paid rerolls
- manager picks
- formation picks across the 12 PRD formations
- automatic best-slot player placement
- manual field-slot swaps
- position fit penalties
- club, nation, line, combo, manager, and experience rating breakdowns
- one local saved team slot
- AI bot teams generated through the same draft/rating rules
- solo match simulation using the PRD Elo-style win probability
- local leaderboard
- online architecture notes
- smaller 3D-style field layout
- friend 1v1 mode with invite links and best-of-5 series (PeerJS, honor-system)
- World Cup-style group stage plus knockout cup simulation
- larger player pool with more curated era/team packs
- rebalanced game ratings with a wider spread across tiers
- generated card-sheet art pipeline notes

## Rating scale

Player data keeps a `peakRating` estimate for historical flavor, but gameplay uses a rebalanced `rating`:

- `S`: 88-100
- `A`: 76-88
- `B`: 62-78
- `C`: 48-64

This keeps true all-time signatures rare while making ordinary starters, role players, and lower-tier cards matter as draft tradeoffs.

Random mixed packs also use tier weighting, so S-tier cards are rare outside curated packs.

## Important product decision

Solo play can stay client-side while the game rules are still changing. Online play should not trust client-side state. Draft RNG, paid rerolls, saved teams, match results, and leaderboard records need server authority before real competitive play.

See `docs/online-architecture.md`.
See `docs/card-art-pipeline.md` for the recommended generated card-sheet workflow.

## Good next engineering step

Split `app.js` into:

- `data.js`
- `rules.js`
- `state.js`
- `ui.js`

That keeps the current static game intact while making the rules reusable for a future API server.
