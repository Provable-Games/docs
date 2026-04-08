import { defineConfig } from "vocs";

export default defineConfig({
rootDir: "src",
  title: "Provable Games",
  description:
    "Using cryptography to create incorruptible and indestructible fun.",
  iconUrl: "/favicon.ico",
  logoUrl: "/logo.svg",
  ogImageUrl: "/new-banner.png",
  socials: [
    {
      icon: "github",
      link: "https://github.com/Provable-Games",
    },
    {
      icon: "discord",
      link: "https://discord.gg/Q36rUxS66c",
    },
    {
      icon: "x",
      link: "https://x.com/provablegames",
    },
  ],
  editLink: {
    pattern: "https://github.com/provable-games/docs/blob/main/src/pages/:path",
    text: "Edit on GitHub",
  },
  theme: {
    colorScheme: "dark",
    variables: {
      color: {
        textAccent: "#46A9F0",
        background: "#0c0c0c",
        backgroundDark: "#121212",
        noteBackground: "#1a1a1a",
      },
    },
  },
  // Seperate sidebars for different sections
  sidebar: {
    // Budokan sidebar
    "/budokan": [
      {
        text: "Budokan",
        items: [
          { text: "Overview", link: "/budokan" },
          { text: "Onboarding", link: "/budokan/guide/onboarding" },
        ],
      },
      {
        text: "Playing",
        items: [
          { text: "Enter Tournaments", link: "/budokan/guide/enter" },
          { text: "Submission", link: "/budokan/guide/submission" },
          { text: "Prizes", link: "/budokan/guide/prizes" },
        ],
      },
      {
        text: "Creating",
        items: [
          { text: "Create a Tournament", link: "/budokan/guide/create" },
          { text: "Game Settings", link: "/budokan/guide/create/game-settings" },
          { text: "Entry Fees", link: "/budokan/guide/create/entry-fees" },
          { text: "Entry Requirements", link: "/budokan/guide/create/entry-requirements" },
          { text: "Best Practices", link: "/budokan/guide/create/best-practices" },
        ],
      },
      {
        text: "Reference",
        items: [
          { text: "Key Functions", link: "/budokan/key-functions" },
          { text: "SDK", link: "/budokan/sdk" },
          { text: "FAQ", link: "/budokan/faq" },
        ],
      },
    ],
    // Embeddable Game Standard sidebar
    "/embeddable-game-standard": [
      {
        text: "Embeddable Game Standard",
        items: [
          { text: "Overview", link: "/embeddable-game-standard" },
          { text: "Architecture", link: "/embeddable-game-standard/architecture" },
        ],
      },
      {
        text: "Building a Game",
        items: [
          { text: "Overview", link: "/embeddable-game-standard/building-a-game" },
          { text: "Quick Start", link: "/embeddable-game-standard/building-a-game/quick-start" },
          { text: "Score & Game Over", link: "/embeddable-game-standard/building-a-game/score-and-game-over" },
          { text: "Settings & Objectives", link: "/embeddable-game-standard/building-a-game/settings-and-objectives" },
          { text: "Lifecycle & Playability", link: "/embeddable-game-standard/building-a-game/lifecycle" },
        ],
      },
      {
        text: "Building a Platform",
        items: [
          { text: "Overview", link: "/embeddable-game-standard/building-a-platform" },
          { text: "MetagameComponent", link: "/embeddable-game-standard/building-a-platform/metagame" },
          { text: "Callbacks & Automation", link: "/embeddable-game-standard/building-a-platform/callbacks" },
          { text: "Registry & Discovery", link: "/embeddable-game-standard/building-a-platform/registry" },
        ],
      },
      {
        text: "game-components Reference",
        items: [
          { text: "Overview", link: "/embeddable-game-standard/reference" },
          { text: "MinigameToken (ERC721)", link: "/embeddable-game-standard/reference/token" },
          { text: "Token Extensions", link: "/embeddable-game-standard/reference/token-extensions" },
          { text: "MinigameComponent", link: "/embeddable-game-standard/reference/minigame" },
          { text: "MetagameComponent", link: "/embeddable-game-standard/reference/metagame" },
          { text: "RegistryComponent", link: "/embeddable-game-standard/reference/registry" },
          { text: "Metagame Extensions", link: "/embeddable-game-standard/reference/metagame-extensions" },
        ],
      },
      {
        text: "Frontend Integration",
        items: [
          { text: "Overview", link: "/embeddable-game-standard/frontend" },
          { text: "denshokan-sdk", link: "/embeddable-game-standard/frontend/sdk" },
          { text: "Types Reference", link: "/embeddable-game-standard/frontend/types" },
          { text: "React Hooks", link: "/embeddable-game-standard/frontend/react-hooks" },
          { text: "WebSocket Subscriptions", link: "/embeddable-game-standard/frontend/websockets" },
        ],
      },
      {
        text: "Advanced Topics",
        items: [
          { text: "Packed Token IDs", link: "/embeddable-game-standard/advanced/packed-token-ids" },
          { text: "SRC5 Interface Discovery", link: "/embeddable-game-standard/advanced/src5" },
        ],
      },
      {
        text: "Ecosystem",
        items: [
          { text: "Games", link: "/embeddable-game-standard/games" },
          { text: "Applications", link: "/embeddable-game-standard/applications" },
          { text: "FAQ", link: "/embeddable-game-standard/faq" },
        ],
      },
    ],
    // Dark Shuffle sidebar
    "/darkshuffle": [
      {
        text: "Dark Shuffle",
        items: [
          { text: "Overview", link: "/darkshuffle" },
          { text: "Onboarding", link: "/darkshuffle/guide/onboarding" },
        ],
      },
      {
        text: "Guide",
        items: [
          { text: "Draft", link: "/darkshuffle/guide/draft" },
          { text: "Cards", link: "/darkshuffle/guide/cards" },
          { text: "Map", link: "/darkshuffle/guide/map" },
          { text: "Battle", link: "/darkshuffle/guide/battle" },
        ],
      },
      {
        text: "Reference",
        items: [
          { text: "Key Functions", link: "/darkshuffle/key-functions" },
          { text: "Settings", link: "/darkshuffle/settings" },
          { text: "FAQ", link: "/darkshuffle/faq" },
        ],
      },
    ],
    // Summit sidebar
    "/summit": [
      {
        text: "Summit",
        items: [
          { text: "Overview", link: "/summit" },
        ],
      },
      {
        text: "Gameplay",
        items: [
          { text: "Battle System", link: "/summit/battle-system" },
          { text: "Beast Upgrades", link: "/summit/beast-upgrades" },
          { text: "Consumables", link: "/summit/consumables" },
        ],
      },
      {
        text: "Economy",
        items: [
          { text: "Rewards", link: "/summit/rewards" },
          { text: "Quests", link: "/summit/quests" },
        ],
      },
      {
        text: "Reference",
        items: [
          { text: "FAQ", link: "/summit/faq" },
          { text: "Disclaimers", link: "/summit/disclaimers" },
        ],
      },
    ],
    // Loot Survivor sidebar
    "/lootsurvivor": [
      {
        text: "Loot Survivor",
        items: [
          { text: "Overview", link: "/lootsurvivor" },
          { text: "Platforms", link: "/lootsurvivor/platforms" },
        ],
      },
      {
        text: "Guide",
        items: [
          { text: "Getting Started", link: "/lootsurvivor/guide/getting-started" },
          { text: "Explore", link: "/lootsurvivor/guide/explore" },
          { text: "Battle", link: "/lootsurvivor/guide/battle" },
          { text: "Upgrade", link: "/lootsurvivor/guide/upgrade" },
        ],
      },
      {
        text: "Game Mechanics",
        items: [
          { text: "Dungeon Tickets", link: "/lootsurvivor/dungeon-tickets" },
          { text: "Stats", link: "/lootsurvivor/stats" },
          { text: "Combat", link: "/lootsurvivor/combat" },
          { text: "Market", link: "/lootsurvivor/market" },
        ],
      },
      {
        text: "Loot & Beasts",
        items: [
          { text: "Loot", link: "/lootsurvivor/loot" },
          { text: "Suffix Boosts", link: "/lootsurvivor/loot/suffix-boost" },
          { text: "Jewelry", link: "/lootsurvivor/loot/jewelry" },
          { text: "Beasts", link: "/lootsurvivor/beasts" },
          { text: "Collectibles", link: "/lootsurvivor/beasts/collectibles" },
          { text: "Wanted Beasts", link: "/lootsurvivor/beasts/wanted-beasts" },
        ],
      },
      {
        text: "Tokens",
        items: [
          { text: "Token", link: "/lootsurvivor/token" },
          { text: "Tokenomics", link: "/lootsurvivor/token/tokenomics" },
          { text: "Airdrop", link: "/lootsurvivor/token/airdrop" },
          { text: "Eligible Collections", link: "/lootsurvivor/token/eligible-collections" },
          { text: "Golden Token", link: "/lootsurvivor/golden-token" },
          { text: "Skull Token", link: "/lootsurvivor/skull-token" },
          { text: "Corpse Token", link: "/lootsurvivor/corpse-token" },
        ],
      },
      {
        text: "Reference",
        items: [
          { text: "Contracts", link: "/lootsurvivor/contracts" },
          { text: "FAQ", link: "/lootsurvivor/faq" },
        ],
      },
    ],
  },
});
