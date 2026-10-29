import type { CSSProperties, ReactNode } from "react";

type Accent = { "--accent": string } & CSSProperties;
const accent = (hex: string): Accent => ({ "--accent": hex });

const lootSurvivor = {
  name: "Loot Survivor",
  logo: "/ls-logo.svg",
  href: "/lootsurvivor",
  accent: "#33FF33",
  genre: "Dungeon crawler",
  description:
    "A procedurally generated dungeon crawler. Explore an endless dungeon, fight for your life against beasts and obstacles, and collect the beasts you defeat.",
  links: [
    { label: "Getting started", href: "/lootsurvivor/guide/getting-started" },
    { label: "Game modes", href: "/lootsurvivor/game-modes" },
    { label: "Beasts", href: "/lootsurvivor/beasts/collectibles" },
    { label: "Contracts", href: "/lootsurvivor/contracts" },
  ],
};

function Chips({ links }: { links: { label: string; href: string }[] }) {
  return (
    <ul className="relative z-10 flex flex-wrap gap-1.5">
      {links.map((l) => (
        <li key={l.href}>
          <a href={l.href} className="pg-chip inline-flex rounded-full px-2.5 py-1 text-[12px]">
            {l.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

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
              Start playing
            </a>
            <a href="/budokan/sdk" className="pg-btn-ghost inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-[14px] font-medium">
              <span className="text-white/40">Developers</span>
              <span className="h-3.5 w-px bg-white/15" />
              Build with Budokan <Arrow />
            </a>
          </div>
        </div>
      </section>

      <div className="mx-auto flex max-w-[72rem] flex-col gap-24 px-5 pb-36 sm:gap-28 sm:px-8">
        {/* ---------- Games ---------- */}
        <section>
          <SectionHeading id="games" index="01" kicker="Game" title="Play">
            Learn the rules, the strategy and how every result is proven.
          </SectionHeading>
          <div className="pg-card pg-feature group relative grid grid-cols-[minmax(0,1fr)] overflow-hidden rounded-3xl lg:grid-cols-[1.05fr_1fr]" style={accent(lootSurvivor.accent)}>
            <div className="relative z-10 order-2 flex flex-col justify-center gap-6 p-7 sm:p-10 lg:order-1">
              <div className="flex flex-col gap-3">
                <p className="pg-mono pg-accent-text text-[11px] uppercase tracking-[0.18em]">{lootSurvivor.genre}</p>
                <h3 className="text-2xl font-semibold tracking-[-0.02em] text-white">{lootSurvivor.name}</h3>
                <p className="max-w-[42ch] text-[16px] leading-relaxed text-white/60">{lootSurvivor.description}</p>
              </div>
              <Chips links={lootSurvivor.links} />
              <a href={lootSurvivor.href} className="pg-stretched pg-cta mt-2 flex items-center gap-1.5 text-[14px] font-medium">
                Read the Loot Survivor docs <Arrow />
              </a>
            </div>
            <div className="pg-art relative order-1 flex h-44 items-center justify-center overflow-hidden sm:h-56 lg:order-2 lg:h-auto lg:min-h-[20rem]">
              <div className="pg-art-dots absolute inset-0" />
              <div className="pg-art-glow absolute inset-x-0 -bottom-16 mx-auto h-48 w-4/5 rounded-full" />
              <img src={lootSurvivor.logo} alt={lootSurvivor.name} className="pg-logo relative h-9 w-auto max-w-[80%] object-contain sm:h-11" />
            </div>
          </div>
        </section>

        {/* ---------- Platform ---------- */}
        <section>
          <SectionHeading id="compete" index="02" kicker="Platform" title="Compete">
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
              <Chips
                links={[
                  { label: "Enter a tournament", href: "/budokan/guide/enter" },
                  { label: "Create a tournament", href: "/budokan/guide/create" },
                  { label: "SDK", href: "/budokan/sdk" },
                  { label: "Key functions", href: "/budokan/key-functions" },
                ]}
              />
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
