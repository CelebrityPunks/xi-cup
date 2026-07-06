# XI Cup Online Architecture Notes

## What "client-side solo" means

The current MVP is a fully client-side game. The browser owns:

- the active draft state
- random roll generation
- burned player stacks
- auto-placement
- rating calculation
- bot teams
- match simulation
- saved team storage through `localStorage`

That is the right shape for fast solo prototyping because the player can open `index.html` and play without a server.

## What changes for online

Competitive online play cannot trust the browser. A player could edit local storage, change JavaScript, or submit a fake rating. For online play, the server needs to own:

- draft creation and seed/RNG
- pack selection and burned stacks
- player, manager, formation picks
- free and paid reroll counts
- saved team slots
- match limits
- match simulation results
- team experience gains
- leaderboard ranking
- tournament queues and brackets

The browser should render state returned by the server and send player intentions such as "pick player 12" or "use reroll." It should not be allowed to submit final ratings or match wins.

## Recommended split

Keep pure game rules in shared modules:

- pack generation
- position fit
- auto-placement
- chemistry scoring
- combo scoring
- manager bonus scoring
- Elo-style match odds

Use those modules in both places:

- client: instant UI previews
- server: authoritative persistence and validation

## First backend API shape

```txt
POST /drafts
  starts a new draft and returns the first roll

POST /drafts/:id/pick
  body: { type: "player" | "manager" | "formation", id }
  validates the option, burns the stack, returns updated draft

POST /drafts/:id/reroll
  validates free/paid reroll availability, burns the stack, returns next roll

POST /drafts/:id/save
  validates the completed XI and stores the team

GET /teams
  returns saved teams for the user

POST /teams/:id/matches
  enforces daily match limit and simulates an authoritative result

GET /leaderboard
  returns ranked teams

POST /cups/:id/queue
  queues a saved team into a cup
```

## Practical next step

Before adding online accounts, extract the rules from `app.js` into modules such as `rules.js`, `data.js`, and `state.js`. That makes the game easier to test locally and easier to reuse in a future API server.
