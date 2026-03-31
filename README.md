# Florilegium
### *a garden of poetic trace*

**[florilegium.netlify.app](https://florilegium.netlify.app)**

---

Florilegium is an interactive web app where users write emotion-guided poems that bloom into flowers, leaving anonymous poetic traces in a collective living garden. Each flower planted by a user persists in a shared global garden — a quiet, growing map of human feeling expressed through language.

The name comes from the Latin *florilegium* — a collection of flowers, or an anthology of literary extracts.

---

## How it works

1. **Enter the garden** — land on the home page, where existing flowers from all users sway gently across the screen
2. **Choose an emotion** — a random emotion is assigned (Longing, Grief, Elation, Unease, and twelve others), each with three poetic three-word prompts
3. **Select a prompt** — choose one that resonates, then write a poem of at least 15 words across 3 lines that incorporates the prompt words
4. **Generate your card** — the poem is rendered onto a hand-stamped floral card; a fragment of 2–3 lines is extracted and becomes your flower's poetic trace
5. **Plant your flower** — the fragment is saved to the collective garden with an emotion-matched flower illustration; a fly-to-garden animation marks the planting
6. **View the garden** — navigate to the full garden page to see all contributed flowers swaying, hoverable to reveal each poem's trace and emotion

---

## Features

- 15 emotions, each mapped to a unique botanical illustration and three poetic prompts
- Poem validation (minimum word count, line count, prompt word inclusion)
- Dynamic font scaling on the card for poems of any length
- Emotion-matched flower tokens with sway animations
- Hover tooltips revealing emotion label and poetic fragment
- Collective real-time garden persisted in Supabase (Postgres)
- localStorage fallback for offline / pre-load display
- Fly-to-garden planting animation
- Ambient floating flowers on all pages
- Fully responsive for mobile and desktop
- Dedicated full-page garden view (`garden.html`) as the app's final destination

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Vanilla HTML, CSS, JavaScript |
| Database | Supabase (Postgres + REST API) |
| Hosting | Netlify |
| Fonts | Playfair Display, Dancing Script (Google Fonts) |

No frameworks. No build step. Pure static files with a Supabase backend for the collective garden.

---

## Project structure

```
florilegium/
├── index.html        # Landing page + scattered garden
├── create.html       # Emotion + prompt selection
├── write.html        # Poem writing interface
├── card.html         # Card generation + flower planting
├── garden.html       # Full collective garden view
├── script.js         # All JS — routing, Supabase, rendering
├── style.css         # All styles — layout, animations, responsive
├── netlify.toml      # Cache headers + deploy config
└── images/           # Flower illustrations + backgrounds
```

---

## Database schema (Supabase)

```sql
CREATE TABLE blooms (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  fragment   TEXT        NOT NULL,
  emotion    TEXT        NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX blooms_fragment_unique ON blooms (fragment);
```

Row Level Security is enabled. Public SELECT and INSERT are allowed; UPDATE and DELETE are restricted to the service role.

---

## Running locally

No build step required. Clone the repo and open `index.html` in a browser, or serve with any static file server:

```bash
git clone https://github.com/Shrutaswini/florilegium.git
cd florilegium
npx serve .
```

The Supabase connection is live — locally opened pages will read from and write to the same collective garden as the deployed site.

---

## Design notes

The aesthetic draws from botanical illustration, handmade print culture, and the tradition of the *commonplace book* — a personal collection of meaningful fragments. The stamp on each generated card is hand-drawn. The poetic fragments extracted from user poems are intentionally 2–3 lines: specific enough to feel like a real emotional moment, abstract enough to be universally legible.

The garden is anonymous and append-only by design. No accounts, no attribution. Each flower is simply a feeling left behind.

---

*Built by Shrutaswini — 2025*
