"use client";

import { useEffect, useRef, useState } from "react";
import { loadOriginalPage } from "./beastMusicAssets";

const BASE = "/docs/lootsurvivor/beast-music/cards";
const PLAYER_WIDTH = 340;
const PLAYER_HEIGHT = 476;

const CARDS = [
  { slug: "warlock-regular", label: "Regular", alt: '"Gloom Shadow" Warlock, a Regular Beast' },
  { slug: "warlock-shiny", label: "Shiny", alt: '"Wrath Bane" Warlock, a Shiny Beast' },
  { slug: "warlock-midi", label: "MIDI", alt: '"Armageddon Growl" Warlock, a MIDI Beast' },
  { slug: "warlock-shiny-midi", label: "Shiny + MIDI", alt: '"Dusk Root" Warlock, a Shiny + MIDI Beast' },
];

/**
 * Every card is the token's own player page. MIDI cards draw the Named Song's notes behind the art
 * before anything plays. The players are inert until picked, so neither pointer nor keyboard can
 * reach them, and picking one reloads the previous one, so at most one can make a sound.
 */
function PlayerCard({ slug, alt, picked, resets, onPick }: { slug: string; alt: string; picked: boolean; resets: number; onPick: () => void }) {
  const [srcDoc, setSrcDoc] = useState<string | null>(null);
  const [scale, setScale] = useState<number | null>(null);
  const frame = useRef<HTMLDivElement>(null);
  const player = useRef<HTMLIFrameElement>(null);

  // The selection button disappears once picked, so keep keyboard focus on this player.
  useEffect(() => {
    if (picked) player.current?.focus();
  }, [picked]);

  // Below about 250px wide the player page drops its play icon off-centre, so lay it out at its
  // full size and scale the whole page down to fit the card.
  useEffect(() => {
    const element = frame.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / PLAYER_WIDTH));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

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
    <div ref={frame} className="relative w-full overflow-hidden" style={{ aspectRatio: "250 / 350" }}>
      <img src={`${BASE}/${slug}.svg`} alt={alt} className="absolute inset-0 h-full w-full" />
      {srcDoc && scale && (
        <iframe
          key={resets}
          title={alt}
          srcDoc={srcDoc}
          sandbox="allow-scripts"
          referrerPolicy="no-referrer"
          className="absolute top-0 left-0 border-0"
          inert={!picked}
          ref={player}
          style={{
            width: PLAYER_WIDTH,
            height: PLAYER_HEIGHT,
            transform: `scale(${scale})`,
            transformOrigin: "0 0",
          }}
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
      {CARDS.map(({ slug, label, alt }) => (
        <figure key={slug} className="m-0 text-center text-sm">
          <PlayerCard slug={slug} alt={alt} picked={picked === slug} resets={resets[slug] ?? 0} onPick={() => pick(slug)} />
          <figcaption className="mt-2 opacity-80">
            {label}
            {picked === slug ? ": press play on the card" : ": tap to listen"}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
