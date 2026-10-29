import type { CSSProperties, ReactNode } from "react";

type Accent = { "--accent": string } & CSSProperties;
const accent = (hex: string): Accent => ({ "--accent": hex });

const games = [
  {
    name: "Loot Survivor",
    logo: "/ls-logo.svg",
    logoHeight: 26,
    href: "/lootsurvivor",
    accent: "#33FF33",
    genre: "Dungeon crawler",
    description:
      "A procedurally generated onchain dungeon crawler. Explore an endless dungeon and fight for your life against beasts and obstacles.",
    links: [
      { label: "Getting started", href: "/lootsurvivor/guide/getting-started" },
      { label: "Game modes", href: "/lootsurvivor/game-modes" },
      { label: "Contracts", href: "/lootsurvivor/contracts" },
    ],
  },
  {
    name: "Dark Shuffle",
    logo: "/DS - Horizontal Logo.svg",
    logoHeight: 34,
    href: "/darkshuffle",
    accent: "#8B5CF6",
    genre: "Deck builder",
    description:
      "An onchain deck builder. Draft a deck, battle beasts across the map, and play with your own settings and tokens.",
    links: [
      { label: "Draft", href: "/darkshuffle/guide/draft" },
      { label: "Cards", href: "/darkshuffle/guide/cards" },
      { label: "Settings", href: "/darkshuffle/settings" },
    ],
  },
  {
    name: "Summit",
    logo: "/summit-logo.png",
    logoHeight: 52,
    href: "/summit",
    accent: "#F43F5E",
    genre: "King of the hill",
    description:
      "A king-of-the-hill battle where players send their collectable beasts to fight for control of the Summit.",
    links: [
      { label: "Battle system", href: "/summit/battle-system" },
      { label: "Upgrades", href: "/summit/beast-upgrades" },
      { label: "Rewards", href: "/summit/rewards" },
    ],
  },
];

function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={`pg-arrow h-3.5 w-3.5 ${className}`}
    >
      <path
        d="M3 8h9.5M8.5 3.5 13 8l-4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SectionHeading({
  id,
  index,
  kicker,
  title,
  children,
}: {
  id: string;
  index: string;
  kicker: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div id={id} className="pg-anchor mb-8 flex flex-col gap-3 sm:mb-10">
      <p className="pg-mono flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-white/40">
        <span className="text-white/25">{index}</span>
        <span className="h-px w-6 bg-white/15" />
        {kicker}
      </p>
      <h2 className="text-[1.75rem] font-semibold leading-tight tracking-[-0.02em] text-white sm:text-[2rem]">
        {title}
      </h2>
      <p className="max-w-[46ch] text-[15px] leading-relaxed text-white/55">
        {children}
      </p>
    </div>
  );
}

function GameCard({ game }: { game: (typeof games)[number] }) {
  return (
    <div className="pg-card group relative flex flex-col overflow-hidden rounded-2xl" style={accent(game.accent)}>
      {/* Art panel */}
      <div className="pg-art relative flex h-32 items-center justify-center overflow-hidden sm:h-44">
        <div className="pg-art-dots absolute inset-0" />
        <div className="pg-art-glow absolute inset-x-0 -bottom-16 mx-auto h-40 w-4/5 rounded-full" />
        <img
          src={game.logo}
          alt={game.name}
          className="pg-logo relative w-auto max-w-[78%] object-contain"
          style={{ height: game.logoHeight }}
        />
        <div className="pg-art-rule absolute inset-x-0 bottom-0 h-px" />
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex flex-col gap-2">
          <p className="pg-mono pg-accent-text text-[11px] uppercase tracking-[0.18em]">
            {game.genre}
          </p>
          <h3 className="text-lg font-semibold tracking-[-0.01em] text-white">
            <a href={game.href} className="pg-stretched outline-none">
              {game.name}
            </a>
          </h3>
          <p className="text-[14.5px] leading-relaxed text-white/55">
            {game.description}
          </p>
        </div>

        <div className="mt-auto flex flex-col gap-4">
          <ul className="relative z-10 flex flex-wrap gap-1.5">
            {game.links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="pg-chip inline-flex rounded-full px-2.5 py-1 text-[12px]">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <span className="pg-cta flex items-center gap-1.5 text-[13.5px] font-medium">
            Read the docs <Arrow />
          </span>
        </div>
      </div>
    </div>
  );
}

function BracketArt() {
  // An 8-player single-elimination bracket, drawn in Budokan green.
  const rows = [0, 1, 2, 3, 4, 5, 6, 7];
  const y = (i: number) => 22 + i * 34;
  const r1 = [0, 1, 2, 3].map((i) => (y(i * 2) + y(i * 2 + 1)) / 2);
  const r2 = [0, 1].map((i) => (r1[i * 2] + r1[i * 2 + 1]) / 2);
  const f = (r2[0] + r2[1]) / 2;
  const seat = (x: number, cy: number, w: number, k: string, hot = false) => (
    <rect key={k} x={x} y={cy - 9} width={w} height={18} rx={5} className={hot ? "pg-seat-hot" : "pg-seat"} />
  );
  const link = (x1: number, y1: number, y2: number, x2: number, k: string, hot = false) => {
    const mid = (y1 + y2) / 2;
    return (
      <path
        key={k}
        d={`M${x1} ${y1} H${x1 + 14} V${mid} H${x2} M${x1} ${y2} H${x1 + 14} V${mid}`}
        className={hot ? "pg-wire-hot" : "pg-wire"}
      />
    );
  };
  return (
    <svg viewBox="0 0 420 290" className="h-auto w-full" aria-hidden="true">
      {rows.map((i) => seat(12, y(i), 84, `a${i}`, i === 2))}
      {[0, 1, 2, 3].map((i) => link(96, y(i * 2), y(i * 2 + 1), 124, `l1${i}`, i === 1))}
      {r1.map((cy, i) => seat(124, cy, 84, `b${i}`, i === 1))}
      {[0, 1].map((i) => link(208, r1[i * 2], r1[i * 2 + 1], 236, `l2${i}`, i === 0))}
      {r2.map((cy, i) => seat(236, cy, 74, `c${i}`, i === 0))}
      {link(310, r2[0], r2[1], 338, "l3", true)}
      <circle cx={372} cy={f} r={30} className="pg-crown-halo" />
      <circle cx={372} cy={f} r={20} className="pg-crown" />
      <path
        d={`M362 ${f + 5} l2.5 -11 5 6 2.5 -8 2.5 8 5 -6 2.5 11z`}
        className="pg-crown-icon"
      />
    </svg>
  );
}

function EgsGlyph() {
  // A game node wired out to the platforms around it.
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <rect x="8" y="8" width="8" height="8" rx="2" fill="currentColor" />
      <path d="M12 8V4M12 16v4M8 12H4M16 12h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="3" r="1.6" fill="currentColor" />
      <circle cx="12" cy="21" r="1.6" fill="currentColor" />
      <circle cx="3" cy="12" r="1.6" fill="currentColor" />
      <circle cx="21" cy="12" r="1.6" fill="currentColor" />
    </svg>
  );
}

function CodeWindow() {
  return (
    <div className="pg-code overflow-hidden rounded-xl">
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
        <span className="pg-mono ml-2 text-[11px] text-white/35">minigame.cairo</span>
      </div>
      <pre className="pg-mono overflow-x-auto px-4 py-4 text-[12px] leading-[1.75] sm:px-5 sm:text-[13px]">
        <code>
          <span className="text-white/35">{"// Implement one trait to plug into every EGS platform"}</span>
          {"\n"}
          <span className="pg-k">pub trait</span> <span className="pg-t">IMinigameTokenData</span>
          {"<TState> {\n"}
          {"    "}<span className="pg-k">fn</span> <span className="pg-f">score</span>
          {"(self: @TState, token_id: felt252) -> "}<span className="pg-t">u64</span>{";\n"}
          {"    "}<span className="pg-k">fn</span> <span className="pg-f">game_over</span>
          {"(self: @TState, token_id: felt252) -> "}<span className="pg-t">bool</span>{";\n"}
          {"}"}
        </code>
      </pre>
    </div>
  );
}

export function HomePage() {
  return (
    <div className="pg-home relative isolate overflow-x-clip text-white">
      {/* ---------- Hero ---------- */}
      <section className="relative">
        <div className="pg-hero-bg pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="pg-hero-grid absolute inset-0" />
          <div className="pg-hero-glow absolute left-1/2 top-[-12rem] h-[34rem] w-[min(64rem,140vw)] -translate-x-1/2 rounded-full" />
        </div>

        <div className="mx-auto flex max-w-[72rem] flex-col items-center px-5 pb-20 pt-24 text-center sm:px-8 sm:pb-28 sm:pt-28">
          <a
            href="#games"
            className="pg-pill mb-8 inline-flex items-center gap-2.5 rounded-full py-1.5 pl-1.5 pr-3.5 text-[13px] text-white/70"
          >
            <img src="/PG-logomark-inverted.svg" alt="" className="h-6 w-6 rounded-[6px]" />
            Provable Games documentation
          </a>

          <h1 className="max-w-[18ch] text-balance text-[2.5rem] font-semibold leading-[1.04] tracking-[-0.035em] sm:text-[3.6rem] lg:text-[4.25rem]">
            Play. <span className="pg-gradient-text">Prove.</span> Persist.
          </h1>

          <p className="mt-6 max-w-[36rem] text-pretty text-[16px] leading-relaxed text-white/55 sm:text-[17px]">
            Games where every run, match and prize can be proven, so nobody can rig them,
            shut them down or take what you've won. Learn how to play, and how it's proven.
          </p>

          <div className="mt-10 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
            <a href="#games" className="pg-btn-primary inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-[14px] font-medium">
              <span className="text-black/45">Players</span>
              <span className="h-3.5 w-px bg-black/15" />
              Explore the games
            </a>
            <a href="#build" className="pg-btn-ghost inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-[14px] font-medium">
              <span className="text-white/40">Developers</span>
              <span className="h-3.5 w-px bg-white/15" />
              Start building <Arrow />
            </a>
          </div>

          <ul className="pg-strip mt-16 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:mt-20 sm:gap-x-14">
            {[
              { src: "/ls-logo.svg", alt: "Loot Survivor", href: "/lootsurvivor", h: 15 },
              { src: "/DS - Horizontal Logo.svg", alt: "Dark Shuffle", href: "/darkshuffle", h: 22 },
              { src: "/summit-logo.png", alt: "Summit", href: "/summit", h: 30 },
              { src: "/budokan-logo.svg", alt: "Budokan", href: "/budokan", h: 22 },
            ].map((l) => (
              <li key={l.href}>
                <a href={l.href} className="block">
                  <img src={l.src} alt={l.alt} className="w-auto" style={{ height: l.h }} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="mx-auto flex max-w-[72rem] flex-col gap-24 px-5 pb-36 sm:gap-28 sm:px-8">
        {/* ---------- Games ---------- */}
        <section>
          <SectionHeading id="games" index="01" kicker="Play" title="Games">
            Learn the rules, the strategy and how every result is proven.
          </SectionHeading>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {games.map((g) => (
              <GameCard key={g.name} game={g} />
            ))}
          </div>
        </section>

        {/* ---------- Platform ---------- */}
        <section>
          <SectionHeading id="compete" index="02" kicker="Compete" title="Platform">
            Run and enter tournaments for any compatible game.
          </SectionHeading>

          <div className="pg-card pg-feature group relative grid grid-cols-[minmax(0,1fr)] overflow-hidden rounded-3xl lg:grid-cols-[1.05fr_1fr]" style={accent("#10B981")}>
            <div className="relative z-10 flex flex-col justify-center gap-6 p-7 sm:p-10">
              <img src="/budokan-logo.svg" alt="Budokan" className="h-9 w-auto self-start sm:h-10" />
              <p className="max-w-[40ch] text-[16px] leading-relaxed text-white/60">
                An onchain tournament platform. Create a tournament for any game,
                set entry fees, requirements and prizes, then compete for them.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="pg-status inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[12.5px] text-white/80">
                  <span className="pg-dot-live h-1.5 w-1.5 rounded-full" />
                  Brackets <span className="text-white/40">Live</span>
                </span>
                <span className="pg-status inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[12.5px] text-white/80">
                  <span className="h-1.5 w-1.5 rounded-full border border-white/40" />
                  Lobbies <span className="text-white/40">Coming soon</span>
                </span>
              </div>
              <a href="/budokan" className="pg-stretched pg-cta mt-2 flex items-center gap-1.5 text-[14px] font-medium">
                Read the Budokan docs <Arrow />
              </a>
            </div>
            <div className="pg-feature-art relative flex items-center justify-center px-6 pb-8 sm:px-10 lg:py-10">
              <div className="w-full max-w-[26rem]">
                <BracketArt />
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Build ---------- */}
        <section>
          <SectionHeading id="build" index="03" kicker="Build" title="Developer tools">
            Open standards, Cairo components and SDKs for building on the same rails we do.
          </SectionHeading>

          <div className="pg-card pg-feature group relative grid grid-cols-[minmax(0,1fr)] overflow-hidden rounded-3xl lg:grid-cols-[1fr_1.05fr]" style={accent("#46A9F0")}>
            <div className="pg-feature-art relative order-2 flex items-center px-5 pb-7 sm:px-10 sm:pb-10 lg:order-1 lg:py-10">
              <div className="relative z-10 w-full min-w-0">
                <CodeWindow />
              </div>
            </div>
            <div className="relative z-10 order-1 flex flex-col justify-center gap-6 p-7 sm:p-10 lg:order-2">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="pg-icon-tile flex h-9 w-9 items-center justify-center rounded-lg">
                    <EgsGlyph />
                  </span>
                  <p className="pg-mono pg-accent-text text-[11px] uppercase tracking-[0.18em]">Open standard</p>
                </div>
                <h3 className="text-2xl font-semibold tracking-[-0.02em] text-white">
                  Embeddable Game Standard
                </h3>
                <p className="max-w-[42ch] text-[16px] leading-relaxed text-white/60">
                  Makes onchain games portable and composable. Implement one trait and
                  your game works with every EGS platform, from tournaments to quests.
                </p>
              </div>
              <ul className="relative z-10 flex flex-wrap gap-1.5">
                {[
                  { label: "Build a game", href: "/embeddable-game-standard/building-a-game" },
                  { label: "Build a platform", href: "/embeddable-game-standard/building-a-platform" },
                  { label: "Frontend SDK", href: "/embeddable-game-standard/frontend" },
                ].map((l) => (
                  <li key={l.href}>
                    <a href={l.href} className="pg-chip inline-flex rounded-full px-2.5 py-1 text-[12px]">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
              <a href="/embeddable-game-standard" className="pg-stretched pg-cta mt-2 flex items-center gap-1.5 text-[14px] font-medium">
                Read the EGS docs <Arrow />
              </a>
            </div>
          </div>
        </section>

        {/* ---------- Footer strip ---------- */}
        <section className="flex flex-col items-start justify-between gap-6 border-t border-white/[0.08] pt-10 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <img src="/PG-logomark-inverted.svg" alt="" className="h-8 w-8 rounded-lg" />
            <div>
              <p className="text-[14px] font-medium text-white/85">Provable Games</p>
              <p className="text-[13px] text-white/45">Play. Prove. Persist.</p>
            </div>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-[13.5px] text-white/50">
            <a className="pg-foot-link" href="https://github.com/Provable-Games" target="_blank" rel="noreferrer">GitHub</a>
            <a className="pg-foot-link" href="https://discord.gg/Q36rUxS66c" target="_blank" rel="noreferrer">Discord</a>
            <a className="pg-foot-link" href="https://x.com/provablegames" target="_blank" rel="noreferrer">X</a>
          </nav>
        </section>
      </div>
    </div>
  );
}
