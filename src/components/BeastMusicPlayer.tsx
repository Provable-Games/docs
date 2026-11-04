"use client";

import { useEffect, useState } from "react";
import { loadLivePage, loadOriginalPage, loadToken, type TokenAssets } from "./beastMusicAssets";
import manifest from "./beastMusicManifest.json";

/**
 * Plays Beast tracks in the token's own onchain player page, inside a sandboxed iframe. The iframe
 * is replaced on every change, so at most one track can be playing.
 */

type SoundMode = "original" | "live";
type View = { status: "idle" } | { status: "loading"; message: string } | { status: "ready"; srcDoc: string } | { status: "error"; message: string };

const STANDARD_TRACKS = [
  { key: "sound-check", label: "Sound Check" },
  { key: "species-song", label: "Species Song" },
  { key: "named-song", label: "Named Song" },
];

const fieldClass =
  "w-full rounded-md border border-white/15 bg-[#121212] px-3 py-2 text-sm text-white/90 focus:outline-2 focus:outline-[#46a9f0] disabled:opacity-60";
const buttonClass =
  "rounded-md border border-[#46a9f0]/60 bg-[#46a9f0]/15 px-4 py-2 text-sm font-semibold text-white/90 hover:bg-[#46a9f0]/25 disabled:cursor-not-allowed disabled:opacity-50";

export function BeastMusicPlayer() {
  const [beastIndex, setBeastIndex] = useState(0);
  const [rarityIndex, setRarityIndex] = useState(3);
  const [trackKey, setTrackKey] = useState("named-song");
  const [mode, setMode] = useState<SoundMode>("original");
  const [liveRequested, setLiveRequested] = useState<Set<string>>(new Set());
  const [attempt, setAttempt] = useState(0);
  const [view, setView] = useState<View>({ status: "idle" });
  const [token, setToken] = useState<{ slug: string; assets: TokenAssets } | null>(null);

  const beast = manifest.beasts[beastIndex];
  const rarity = beast.rarities[rarityIndex] as (typeof beast.rarities)[number] & { purchased?: { key: string; label: string }[] };
  const slug = rarity.slug;
  const tracks = [...STANDARD_TRACKS, ...(rarity.purchased ?? [])];
  const selectedTrack = tracks.some((track) => track.key === trackKey) ? trackKey : "sound-check";
  const liveWanted = mode === "live" && liveRequested.has(slug);

  useEffect(() => {
    let current = true;
    loadToken(slug).then(
      (assets) => current && setToken({ slug, assets }),
      () => undefined,
    );
    if (mode === "live" && !liveWanted) {
      setView({ status: "idle" });
      return () => {
        current = false;
      };
    }
    setView({ status: "loading", message: mode === "live" ? `Reading the Live Named Song of ${rarity.name} from mainnet` : "Loading the track" });
    (mode === "live" ? loadLivePage(slug) : loadOriginalPage(slug, selectedTrack)).then(
      (srcDoc) => current && setView({ status: "ready", srcDoc }),
      (cause) => current && setView({ status: "error", message: cause instanceof Error ? cause.message : "Could not load the track." }),
    );
    return () => {
      current = false;
    };
  }, [slug, selectedTrack, mode, liveWanted, attempt, rarity.name]);

  const requestLive = () => {
    setLiveRequested((previous) => new Set(previous).add(slug));
    setAttempt((value) => value + 1);
  };

  const track = token?.slug === slug ? token.assets.tracks.find((candidate) => candidate.key === selectedTrack) : undefined;
  const namedTrack = token?.slug === slug ? token.assets.tracks.find((candidate) => candidate.key === "named-song") : undefined;
  const shownEffects = mode === "live" ? namedTrack?.effects : track?.effects;
  const echoNote =
    mode === "original" && selectedTrack === "sound-check" && track?.effects.toLowerCase().includes("echo")
      ? " Sound Checks skip the chip echo; the preset still changes their tempo, loudness and articulation."
      : "";

  return (
    <div className="not-prose my-6 rounded-lg border border-white/10 p-4 sm:p-5" data-beast-music-player>
      <div className="grid gap-5 md:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
        <div>
          <div className="relative mx-auto flex w-full max-w-[340px] items-center justify-center overflow-hidden rounded-xl bg-black" style={{ aspectRatio: "250 / 350" }}>
            {view.status === "ready" ? (
              <iframe
                key={`${slug}/${mode}/${mode === "live" ? "named-song" : selectedTrack}`}
                title={`Onchain player for ${rarity.name}`}
                srcDoc={view.srcDoc}
                sandbox="allow-scripts"
                referrerPolicy="no-referrer"
                className="absolute inset-0 h-full w-full border-0"
              />
            ) : (
              <span className="px-6 text-center text-sm text-white/60">{view.status === "loading" ? "Loading…" : rarity.name}</span>
            )}
          </div>
        </div>

        <div className="min-w-0 space-y-4 text-sm text-white/80">
          <label className="block space-y-1">
            <span className="font-medium text-white/90">Beast</span>
            <select className={fieldClass} value={beastIndex} onChange={(event) => setBeastIndex(Number(event.target.value))}>
              {manifest.beasts.map((candidate, index) => (
                <option key={candidate.name} value={index}>
                  {candidate.name} ({candidate.type}, T{candidate.tier})
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-1">
            <span className="font-medium text-white/90">Rarity</span>
            <select className={fieldClass} value={rarityIndex} onChange={(event) => setRarityIndex(Number(event.target.value))}>
              {beast.rarities.map((candidate, index) => (
                <option key={candidate.slug} value={index}>
                  {candidate.rarity}: {candidate.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-1">
            <span className="font-medium text-white/90">Track</span>
            <select className={fieldClass} value={mode === "live" ? "named-song" : selectedTrack} disabled={mode === "live"} onChange={(event) => setTrackKey(event.target.value)}>
              {tracks.map((candidate) => (
                <option key={candidate.key} value={candidate.key}>
                  {candidate.label}
                </option>
              ))}
            </select>
          </label>

          <fieldset className="space-y-2">
            <legend className="mb-1 font-medium text-white/90">Sound mode</legend>
            <label className="flex items-start gap-2">
              <input type="radio" name="beast-sound-mode" className="mt-1" checked={mode === "original"} onChange={() => setMode("original")} />
              <span>
                Original <span className="text-white/60">(the music as the track was minted)</span>
              </span>
            </label>
            <label className="flex items-start gap-2">
              <input type="radio" name="beast-sound-mode" className="mt-1" checked={mode === "live"} onChange={() => setMode("live")} />
              <span>
                Live <span className="text-white/60">(the Named Song as it drifts with the chain right now)</span>
              </span>
            </label>
          </fieldset>

          {mode === "live" && !liveWanted && (
            <button type="button" className={buttonClass} onClick={requestLive}>
              Read Live from mainnet
            </button>
          )}

          <div aria-live="polite" className="min-h-6 space-y-2">
            {view.status === "ready" && (
              <p className="text-white/70">
                Ready. Press play on the card.
              </p>
            )}
            {view.status === "error" && (
              <div role="alert" className="space-y-2">
                <p className="text-[#ff9b9b]">{view.message}{mode === "live" ? " The Original tracks and the rest of this page still work." : ""}</p>
                <button type="button" className={buttonClass} onClick={() => setAttempt((value) => value + 1)}>
                  Retry
                </button>
              </div>
            )}
            {mode === "original" && track && (
              <p className="text-white/60">
                Sound mode: {track.mode}. Effects: {track.effects} ({track.effectsFrom === "token" ? "from the token" : "King-controlled"}).{echoNote} Recorded from mainnet at block{" "}
                {manifest.capture.block.toLocaleString("en-US")} ({manifest.capture.date}).
              </p>
            )}
            {mode === "live" && (
              <p className="text-white/60">
                Live reads this Beast's Named Song from mainnet as it would play now{shownEffects ? `, with ${shownEffects} effects` : ""}. Nothing about the Beast changes. It needs no wallet or signature.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
