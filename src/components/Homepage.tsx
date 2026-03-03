const gameCards = [
  {
    title: "Loot Survivor",
    icon: "/ls-logo.svg",
    link: "/lootsurvivor",
    accent: "#F59E0B",
    description:
      "A procedurally generated dungeon crawler. Explore the endless dungeon while fighting for your life against beasts and treacherous obstacles.",
  },
  {
    title: "Dark Shuffle",
    icon: "/DS - Horizontal Logo.svg",
    link: "/darkshuffle",
    accent: "#8B5CF6",
    description:
      "A build-your-own and bring-your-own-tokens onchain deck builder.",
  },
  {
    title: "Budokan",
    icon: "/budokan-logo.svg",
    link: "/budokan",
    accent: "#10B981",
    description:
      "A feature-rich onchain tournament platform that lets anyone create and compete in onchain tournaments.",
  },
  {
    title: "Summit",
    icon: "/summit-logo.png",
    link: "/summit",
    accent: "#F43F5E",
    description:
      "An all-against-all, king-of-the-hill battle game where players use their collectable beasts to fight for control of the Summit.",
  },
];

const toolCard = {
  title: "Embeddable Game Standard",
  icon: "/embeddable-game-standard.png",
  link: "/embeddable-game-standard",
  accent: "#46A9F0",
  description:
    "Makes onchain games portable, composable, and compatible with an ever-expanding ecosystem of applications.",
};

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4">
      <span
        className="text-white/40 uppercase shrink-0"
        style={{
          fontFamily: '"IBM Plex Mono", monospace',
          fontSize: "11px",
          letterSpacing: "0.2em",
        }}
      >
        {label}
      </span>
      <div className="flex-1 h-px bg-white/10" />
    </div>
  );
}

export function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Compact Hero */}
      <div
        className="border-b border-white/10"
        style={{
          background:
            "linear-gradient(to right, rgba(22,37,50,0.6), transparent)",
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-4 sm:py-5 lg:py-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <img
              src="/PG-logomark-inverted.svg"
              alt="PG Logo"
              className="h-10 w-10 shrink-0"
            />
            <h1 className="text-lg sm:text-xl lg:text-2xl text-center sm:text-left">
              A <span className="text-primary">Web3 game studio</span> creating
              cryptographically verifiable games and autonomous worlds.
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-4 sm:py-5 lg:py-6 flex flex-col gap-4 sm:gap-5 lg:gap-6">
        {/* Games Section */}
        <SectionLabel label="Games" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
          {gameCards.map((card) => (
            <a
              href={card.link}
              key={card.title}
              className="group relative rounded-lg bg-[#111111] border border-white/[0.08] overflow-hidden transition-colors duration-300 ease-out hover:bg-[#151515] flex"
              style={{
                boxShadow: "none",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = `inset 0 0 30px ${card.accent}10`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              {/* Left accent bar */}
              <div
                className="w-[3px] shrink-0 transition-opacity duration-300 ease-out opacity-50 group-hover:opacity-100"
                style={{ backgroundColor: card.accent }}
              />

              {/* Corner glow */}
              <div
                className="absolute top-0 left-0 w-24 h-24 rounded-full blur-2xl transition-opacity duration-500 ease-out opacity-0 group-hover:opacity-20 pointer-events-none"
                style={{ backgroundColor: card.accent }}
              />

              {/* Card content */}
              <div className="relative z-10 p-4 sm:p-5 lg:p-6 flex flex-col gap-3">
                <div className="flex items-center h-6">
                  <img
                    src={card.icon}
                    alt={card.title}
                    className="h-6 w-auto object-contain"
                  />
                </div>
                <p
                  className="text-white/50 group-hover:text-white/75 transition-colors duration-300 ease-out"
                  style={{
                    fontFamily: '"IBM Plex Mono", monospace',
                    fontSize: "13px",
                    lineHeight: "1.7em",
                  }}
                >
                  {card.description}
                </p>
              </div>
            </a>
          ))}
        </div>

        {/* Developer Tools Section */}
        <SectionLabel label="Developer Tools" />
        <a
          href={toolCard.link}
          className="group relative rounded-lg bg-[#111111] border border-dashed border-white/[0.12] overflow-hidden transition-colors duration-300 ease-out hover:bg-[#151515]"
          style={{ boxShadow: "none" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow = `inset 0 0 30px ${toolCard.accent}10`;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow = "none";
          }}
        >
          {/* Mobile: stacked layout, Tablet+: horizontal layout */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5 p-4 sm:p-5 lg:p-6">
            <img
              src={toolCard.icon}
              alt={toolCard.title}
              className="h-6 w-auto shrink-0 object-contain"
            />

            <p
              className="text-white/50 group-hover:text-white/75 transition-colors duration-300 ease-out flex-1"
              style={{
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: "13px",
                lineHeight: "1.7em",
              }}
            >
              {toolCard.description}
            </p>

            <span
              className="hidden sm:inline-flex items-center shrink-0 rounded-full px-3 py-1 text-xs border"
              style={{
                backgroundColor: `${toolCard.accent}15`,
                color: toolCard.accent,
                borderColor: `${toolCard.accent}33`,
                fontFamily: '"IBM Plex Mono", monospace',
              }}
            >
              Standard
            </span>

            <span className="hidden sm:inline-block text-white/30 group-hover:text-white/60 transition-all duration-300 ease-out group-hover:translate-x-1 shrink-0">
              →
            </span>
          </div>
        </a>
      </div>
    </div>
  );
}
