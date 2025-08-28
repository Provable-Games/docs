import { defineConfig } from "vocs";
import llmTxtPlugin from "./vite-plugin-llm-txt.mjs";

export default defineConfig({
  vite: {
    plugins: [llmTxtPlugin()],
  },
  rootDir: "src",
  title: "Provable Games",
  description:
    "A Web3 game studio specializing in games and autonomous worlds that can be cryptographically verified using zero-knowledge proofs.",
  iconUrl: "/favicon.ico",
  logoUrl: "/logo.svg",
  ogImageUrl: "/og-banner.png",
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
          {
            text: "Guide",
            link: "/budokan/guide",
            collapsed: true,
            items: [
              // { text: "Overview", link: "/budokan/guide" },
              { text: "Onboarding", link: "/budokan/guide/onboarding" },
              { text: "Enter Tournaments", link: "/budokan/guide/enter" },
              { text: "Submission", link: "/budokan/guide/submission" },
              {
                text: "Prizes",
                link: "/budokan/guide/prizes",
              },
              {
                text: "Create",
                link: "/budokan/guide/create",
                collapsed: true,
                items: [
                  {
                    text: "Game Settings",
                    link: "/budokan/guide/create/game-settings",
                  },
                  {
                    text: "Entry Fees",
                    link: "/budokan/guide/create/entry-fees",
                  },
                  {
                    text: "Entry Requirements",
                    link: "/budokan/guide/create/entry-requirements",
                  },
                ],
              },
            ],
          },
          { text: "Key Functions", link: "/budokan/key-functions" },
          { text: "FAQ", link: "/budokan/faq" },
        ],
      },
    ],
    // Embeddable Game Standard sidebar
    "/embeddable-game-standard": [
      {
        text: "Embeddable Game Standard",
        items: [
          {
            text: "Overview",
            link: "/embeddable-game-standard",
          },
          {
            text: "Key Functions",
            link: "/embeddable-game-standard/key-functions",
          },
          {
            text: "Implementation",
            link: "/embeddable-game-standard/implementation",
            collapsed: true,
            items: [
              {
                text: "Game Settings",
                link: "/embeddable-game-standard/implementation/settings",
              },
              {
                text: "Embedding Games",
                link: "/embeddable-game-standard/implementation/embedding-games",
              },
            ],
          },
          {
            text: "Games",
            link: "/embeddable-game-standard/games",
          },
          {
            text: "Applications",
            link: "/embeddable-game-standard/applications",
          },
        ],
      },
    ],
    // Dark Shuffle sidebar
    "/darkshuffle": [
      {
        text: "Dark Shuffle",
        items: [
          {
            text: "Overview",
            link: "/darkshuffle",
          },
          {
            text: "Guide",
            link: "/darkshuffle/guide",
            collapsed: true,
            items: [
              { text: "Onboarding", link: "/darkshuffle/guide/onboarding" },
              { text: "Draft", link: "/darkshuffle/guide/draft" },
              { text: "Cards", link: "/darkshuffle/guide/cards" },
              { text: "Map", link: "/darkshuffle/guide/map" },
              { text: "Battle", link: "/darkshuffle/guide/battle" },
            ],
          },
          {
            text: "Key Functions",
            link: "/darkshuffle/key-functions",
          },
          {
            text: "Settings",
            link: "/darkshuffle/settings",
          },
          { text: "FAQ", link: "/darkshuffle/faq" },
        ],
      },
    ],
    // Loot Survivor sidebar
    "/lootsurvivor": [
      {
        text: "Loot Survivor",
        items: [
          {
            text: "Overview",
            link: "/lootsurvivor",
          },
          {
            text: "Platforms",
            link: "/lootsurvivor/platforms",
          },
          {
            text: "Guide",
            link: "/lootsurvivor/guide",
            collapsed: true,
            items: [
              {
                text: "Getting Started",
                link: "/lootsurvivor/guide/getting-started",
              },
              { text: "Explore", link: "/lootsurvivor/guide/explore" },
              { text: "Battle", link: "/lootsurvivor/guide/battle" },
              { text: "Upgrade", link: "/lootsurvivor/guide/upgrade" },
            ],
          },
          {
            text: "Stats",
            link: "/lootsurvivor/stats",
          },
          {
            text: "Combat",
            link: "/lootsurvivor/combat",
          },
          {
            text: "Market",
            link: "/lootsurvivor/market",
          },
          {
            text: "Loot",
            link: "/lootsurvivor/loot",
            collapsed: true,
            items: [
              {
                text: "Suffix Boosts",
                link: "/lootsurvivor/loot/suffix-boost",
              },
              { text: "Jewelry", link: "/lootsurvivor/loot/jewelry" },
            ],
          },
          {
            text: "Beasts",
            link: "/lootsurvivor/beasts",
            collapsed: true,
            items: [
              {
                text: "Collectibles",
                link: "/lootsurvivor/beasts/collectibles",
              },
            ],
          },
          // {
          //   text: "Technical Documentation",
          //   link: "/lootsurvivor/technical",
          //   collapsed: true,
          //   items: [
          //     {
          //       text: "Architecture",
          //       link: "/lootsurvivor/technical/architecture",
          //     },
          //     {
          //       text: "Smart Contracts",
          //       link: "/lootsurvivor/technical/contracts",
          //     },
          //     {
          //       text: "Integration",
          //       link: "/lootsurvivor/technical/integration",
          //     },
          //   ],
          // },
          {
            text: "Contracts",
            link: "/lootsurvivor/contracts",
          },
          { text: "FAQ", link: "/lootsurvivor/faq" },
        ],
      },
    ],
  },
});
