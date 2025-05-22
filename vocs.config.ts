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
      link: "https://github.com/Provable-Games/tournaments",
    },
    {
      icon: "discord",
      link: "https://discord.com/channels/884211910222970891/1354444557449822308",
    },
    {
      icon: "x",
      link: "https://x.com/budokan_gg",
    },
  ],
  theme: {
    colorScheme: "dark",
    variables: {
      color: {
        textAccent: "#f6c297",
        background: "#14100d",
        backgroundDark: "#14100d",
        noteBackground: "#14100d",
      },
    },
  },
  sidebar: [
    {
      text: "Budokan",
      collapsed: false,
      items: [
        { text: "Overview", link: "/budokan" },
        { text: "Key Functions", link: "/budokan/key-functions" },
        {
          text: "Guide",
          link: "/budokan/guide",
          collapsed: true,
          items: [
            { text: "Overview", link: "/budokan/guide" },
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
                { text: "Overview", link: "/budokan/guide/create" },
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
          text: "Implementation Guide",
          collapsed: true,
          items: [
            {
              text: "Overview",
              link: "/embeddable-game-standard/implementation",
            },
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
          link: "/embeddable-game-standard/meta-apps",
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
          text: "Key Functions",
          link: "/darkshuffle/key-functions",
        },
        {
          text: "Guide",
          link: "/darkshuffle/guide",
          items: [
            { text: "Overview", link: "/darkshuffle/guide" },
            { text: "Onboarding", link: "/darkshuffle/guide/onboarding" },
            { text: "Draft", link: "/darkshuffle/guide/draft" },
            { text: "Cards", link: "/darkshuffle/guide/cards" },
            { text: "Map", link: "/darkshuffle/guide/map" },
            { text: "Battle", link: "/darkshuffle/guide/battle" },
          ],
        },
        {
          text: "Settings",
          link: "/darkshuffle/settings",
        },
      ],
    },
  ],
});
