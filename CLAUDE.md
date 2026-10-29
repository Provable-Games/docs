# Provable Games Documentation

Documentation site for Provable Games products, built with [Vocs 2](https://vocs.dev) (Vite + Waku) + React 19.3, rendered fully static.

## Package Manager

Bun (see `bun.lock`). Node 22.12+ (Vite 8); see `.tool-versions`.

## Commands

```bash
bun install        # Install dependencies
bun run dev        # Dev server (with --host)
bun run build      # Production build (vite build → dist/public; on Vercel → .vercel/output)
bun run preview    # Preview production build
```

## Project Structure

```
src/
  pages/           # MDX content organized by product
    index.mdx      # Homepage
    budokan/       # Budokan tournament platform docs
    darkshuffle/   # Dark Shuffle card game docs
    lootsurvivor/  # Loot Survivor docs
    summit/        # Summit docs
    embeddable-game-standard/  # Embeddable Game Standard docs
    _root.css      # Global styles: Tailwind, fonts, Vocs theme variables
  components/      # React components (Button, ContractTable, ContractLink, GameCard, Homepage)
  public/          # Static assets (images in public/docs/)
vocs.config.ts     # Site config, theme, sidebar navigation and markdown plugins
vite.config.ts     # Points Vite's publicDir at src/public; scripts run through vite
```

## Adding/Editing Documentation

1. Pages are `.mdx` files in `src/pages/<product>/`
2. Sidebar navigation for each product section is configured in `vocs.config.ts` under the `sidebar` key
3. Images go in `src/public/docs/`
4. Custom components available: `Button`, `ContractTable`, `ContractLink`, `GameCard`, `Homepage` in `src/components/`
5. Components with event handlers or hooks need a `"use client";` directive (pages render as React Server Components)
6. Cairo code fences (```cairo) are highlighted with the Rust grammar via `codeHighlight.langAlias`
