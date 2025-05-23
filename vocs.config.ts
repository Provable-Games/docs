import { defineConfig } from "vocs";
import llmTxtPlugin from "./vite-plugin-llm-txt.mjs";

export default defineConfig({
  vite: {
    plugins: [llmTxtPlugin()],
  },
  rootDir: "src",
  title: "Provable Games",
  description: "A Dojo-powered tournament platform",
  iconUrl: "/favicon.ico",
  logoUrl: "/logo.svg",
  ogImageUrl: "/logo.svg",
  socials: [
    {
      icon: "github",
      link: "https://github.com/Provable-Games",
    },
    {
      icon: "discord",
      link: "https://discord.com/channels/884211910222970891/1208181734030450709",
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
  sidebar: [
    {
      text: "Budokan",
      collapsed: false,
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
    {
      text: "Embeddable Game Standard",
      collapsed: false,
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
    {
      text: "Dark Shuffle",
      collapsed: false,
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
});
