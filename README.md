# Provable Games Documentation

> Using cryptography to create incorruptible and indestructible fun.

Documentation site for all Provable Games products, built with [Vocs](https://vocs.dev), React 19, and MDX.

## Quick Start

**Prerequisites:** [Bun](https://bun.sh/)

```bash
bun install
bun run dev
```

The dev server starts at `http://localhost:5173`.

To create a production build:

```bash
bun run build
bun run preview
```

## Project Structure

```
src/
  pages/        # MDX documentation pages organized by product
  components/   # React components (ContractTable, GameCard, etc.)
  public/       # Static assets and images
vocs.config.ts  # Site configuration and sidebar navigation
```

## Content Sections

- **[Loot Survivor](/lootsurvivor)** - Onchain survival game with combat, loot, and beasts
- **[Dark Shuffle](/darkshuffle)** - Onchain card game with drafting and battles
- **[Budokan](/budokan)** - Tournament platform for onchain games
- **[Summit](/summit)** - Beast battle game with upgrades and consumables
- **[Embeddable Game Standard](/embeddable-game-standard)** - Standard for embedding onchain games

## Contributing

1. Documentation pages are `.mdx` files in `src/pages/<product>/`
2. Add or edit pages, then update the sidebar navigation in `vocs.config.ts`
3. Place images in `src/public/docs/`
4. Run `bun run build` to verify your changes

## Links

- [GitHub](https://github.com/Provable-Games)
- [Discord](https://discord.gg/Q36rUxS66c)
- [Twitter](https://x.com/provablegames)
