const cardContent = [
  {
    title: "Play tournaments with",
    icon: "/budokan-logo.svg",
    link: "/budokan",
    description:
      "A fully onchain tournament platform. Built for developers and players alike, Budokan provides unprecedented flexibility and composability for onchain games.",
  },
  {
    title: "Build games with",
    icon: "/EGS.png",
    link: "/embeddable-game-standard",
    description:
      "The Embeddable Game Standard (EGS) enables games to communicate across platforms. Beyond powering onchain tournaments, EGS allows games to be utilized in various applications, creating a unified onchain gaming ecosystem.",
  },
  {
    title: "Play",
    icon: "/DS - Horizontal Logo.svg",
    link: "/darkshuffle",
    description:
      "Dark Shuffle is a turn-based, collectible card game. Build your deck, battle monsters, and explore a procedurally generated world.",
  },
];

export function HomePage() {
  return (
    <div className="flex flex-col">
      <div className="border-y border-white/30 bg-[#162532] h-1/4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 flex flex-col sm:flex-row gap-8 sm:gap-20">
          <div className="self-start aspect-square w-full sm:w-1/4 flex items-center justify-center">
            <img
              src="/PG-logomark-inverted.svg"
              alt="PG Logo"
              className="w-3/4 h-3/4 object-contain"
            />
          </div>
          <div className="sm:w-3/4 flex items-center">
            <h1 className="text-3xl sm:text-4xl">
              A <span className="text-primary">Web3 game studio</span>{" "}
              specializing in games and autonomous worlds that can be
              cryptographically verified using zero-knowledge proofs.
            </h1>
          </div>
        </div>
      </div>
      <div className="border-b border-white/30 bg-gradient-to-br from-[#181818] to-[#0c0c0c] h-1/2">
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 ">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {cardContent.map((card, index) => (
              <a
                href={card.link}
                key={index}
                className="p-4 sm:p-6 border border-white/30 rounded-xl bg-gradient-to-br from-[#1B242D] to-[#0c0c0c] bg-opacity-30 backdrop-filter backdrop-blur-lg gap-4 sm:gap-8 shadow-lg hover:shadow-red-600/5 duration-150 hover:bg-[#0c0c0c] hover:bg-opacity-50 cursor-pointer relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-30"></div>
                <div className="relative z-10">
                  <div className="items-center gap-4">
                    <h2 className="text-lg sm:text-xl font-bold">
                      {card.title}
                    </h2>
                    <div className="flex justify-start mt-3 w-auto h-14">
                      <img src={card.icon} alt={card.title} />
                    </div>
                  </div>
                  <div className="mt-6">
                    <p
                      className="text-lg sm:text-xl"
                      style={{
                        fontFamily: '"IBM Plex Mono", monospace',
                        fontSize: "14px",
                        lineHeight: "1.8em",
                      }}
                    >
                      {card.description}
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
