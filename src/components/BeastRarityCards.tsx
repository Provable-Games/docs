"use client";

import { useEffect, useState } from "react";
import { loadOriginalPage } from "./beastMusicAssets";

const BASE = "/docs/lootsurvivor/beast-music/cards";

const CARDS = [
  { slug: "warlock-regular", label: "Regular", alt: '"Gloom Shadow" Warlock, a Regular Beast' },
  { slug: "warlock-shiny", label: "Shiny", alt: '"Wrath Bane" Warlock, a Shiny Beast' },
  { slug: "warlock-midi", label: "MIDI", alt: '"Armageddon Growl" Warlock, a MIDI Beast', player: true },
  { slug: "warlock-shiny-midi", label: "Shiny + MIDI", alt: '"Dusk Root" Warlock, a Shiny + MIDI Beast', player: true },
];

/**
 * The MIDI cards are the tokens' own player pages, which draw the Named Song's notes behind the art
 * before anything plays. The players ignore pointer input until picked, and picking one reloads the
 * other, so at most one can make a sound.
 */
function PlayerCard({ slug, alt, picked, resets, onPick }: { slug: string; alt: string; picked: boolean; resets: number; onPick: () => void }) {
  const [srcDoc, setSrcDoc] = useState<string | null>(null);

  useEffect(() => {
    let current = true;
    loadOriginalPage(slug, "named-song").then(
      (page) => current && setSrcDoc(page),
      () => undefined,
    );
    return () => {
      current = false;
    };
  }, [slug]);

  return (
    <div className="relative w-full" style={{ aspectRatio: "250 / 350" }}>
      <img src={`${BASE}/${slug}.svg`} alt={alt} className="absolute inset-0 h-full w-full" />
      {srcDoc && (
        <iframe
          key={resets}
          title={alt}
          srcDoc={srcDoc}
          sandbox="allow-scripts"
          referrerPolicy="no-referrer"
          className="absolute inset-0 h-full w-full border-0"
          style={{ pointerEvents: picked ? "auto" : "none" }}
        />
      )}
      {srcDoc && !picked && <button type="button" aria-label={`Turn on the player for ${alt}`} className="absolute inset-0 cursor-pointer border-0 bg-transparent" onClick={onPick} />}
    </div>
  );
}

export function BeastRarityCards() {
  const [picked, setPicked] = useState<string | null>(null);
  const [resets, setResets] = useState<Record<string, number>>({});

  const pick = (slug: string) => {
    if (picked) setResets((previous) => ({ ...previous, [picked]: (previous[picked] ?? 0) + 1 }));
    setPicked(slug);
  };

  return (
    <div className="not-prose my-6 grid grid-cols-2 gap-4 lg:grid-cols-4" data-beast-rarity-cards>
      {CARDS.map(({ slug, label, alt, player }) => (
        <figure key={slug} className="m-0 text-center text-sm">
          {player ? (
            <PlayerCard slug={slug} alt={alt} picked={picked === slug} resets={resets[slug] ?? 0} onPick={() => pick(slug)} />
          ) : (
            <img src={`${BASE}/${slug}.svg`} alt={alt} loading="lazy" className="w-full" />
          )}
          <figcaption className="mt-2 opacity-80">
            {label}
            {player ? (picked === slug ? ": press play on the card" : ": tap to listen") : ""}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
