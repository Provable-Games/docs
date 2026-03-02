# Provable Games Documentation

Documentation site for Provable Games products, built with [Vocs](https://vocs.dev) + React 19.

## Package Manager

Bun (see `bun.lock`). Node 20.18.2 (`.tool-versions`).

## Commands

```bash
bun install        # Install dependencies
bun run dev        # Dev server (with --host)
bun run build      # Production build
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
  components/      # React components (ContractTable, ContractLink, GameCard, Homepage)
  public/          # Static assets (images in public/docs/)
vocs.config.ts     # Site config, theme, and sidebar navigation
vite-plugin-llm-txt.mjs  # Vite plugin that generates llm.txt from all MDX content at build time
```

## Adding/Editing Documentation

1. Pages are `.mdx` files in `src/pages/<product>/`
2. Sidebar navigation for each product section is configured in `vocs.config.ts` under the `sidebar` key
3. Images go in `src/public/docs/`
4. Custom components available: `ContractTable`, `ContractLink`, `GameCard`, `Homepage` in `src/components/`
