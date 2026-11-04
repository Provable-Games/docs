"use client";

import { useEffect, useRef, useState } from "react";
import manifest from "./beastMusicManifest.json";

/**
 * Plays Beast tracks in the token's own onchain player page, inside a sandboxed iframe.
 *
 * The page is the token's `animation_url`, captured from mainnet. Its music lives in two inert
 * blocks, which the renderer's `tinysynth_midi_segment` writes for any track. Swapping that segment
 * gives the page the renderer would produce with that track selected.
 *
 * Static samples: page and segment are same-origin files (see scripts/capture-beast-samples.mjs).
 * Live mode: on an explicit click, the segment is read from mainnet in this browser.
 * The iframe is replaced on every change, so at most one track can be playing.
 */

const RPC_URL = "https://rpc.provable.games/rpc";
const RPC_TIMEOUT_MS = 30_000;
const ASSET_BASE = "/docs/lootsurvivor/beast-music";

// starknet_keccak of each entrypoint name.
const GET_SOUND_MANAGER = "0x34d438ea14db03e0875aa336abaab18e382738c77f4a45e990597a51f5f6747";
const GET_RENDERER = "0xc848504e5371922a1ab98cbd2b0593ee3746ff989e8941a897b15eb343a370";
const GET_TRACK_SOUND = "0x304c6a9604c44d757c3d71d2a90796a89cf32bfb9126f6701923532c68fb4f9";
const TINYSYNTH_MIDI_SEGMENT = "0x26263beb2ea712ee2b32f7a5d96d8f044d80d923bc5a1aaf93eaa92470d688b";
// TrackRef::Named is a unit variant with discriminant 2.
const TRACK_REF_NAMED = ["0x2"];

const SEGMENT_START = '<script type="text/plain" id="onchain-midi-settings">';
const DATA_START = '<script type="text/plain" id="onchain-midi-data">';
const SCRIPT_END = "</script>";
const SEGMENT_SHAPE =
  /^<script type="text\/plain" id="onchain-midi-settings">[-0-9,]+<\/script><script type="text\/plain" id="onchain-midi-data">[A-Za-z0-9+/=]+<\/script>\s*$/;

type Source = "static" | "live";
type Beast = (typeof manifest.beasts)[number];
type View =
  | { status: "idle" }
  | { status: "loading"; message: string }
  | { status: "ready"; srcDoc: string; note?: string }
  | { status: "error"; message: string };

const hex = (value: string | bigint) => "0x" + BigInt(value).toString(16);

async function fetchText(path: string, signal: AbortSignal) {
  const response = await fetch(path, { signal });
  if (!response.ok) throw new Error(`Could not load ${path} (HTTP ${response.status}).`);
  return response.text();
}

/** Puts a track's segment in the token page, replacing the settings and MIDI blocks. */
function withSegment(page: string, segment: string) {
  const start = page.indexOf(SEGMENT_START);
  const dataStart = page.indexOf(DATA_START, start);
  const end = page.indexOf(SCRIPT_END, dataStart);
  if (start < 0 || dataStart < 0 || end < 0) throw new Error("This player page has no music blocks.");
  return page.slice(0, start) + segment + page.slice(end + SCRIPT_END.length);
}

async function starknetCall(contract: string, selector: string, calldata: string[], signal: AbortSignal) {
  const response = await fetch(RPC_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    signal,
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "starknet_call",
      params: [{ contract_address: contract, entry_point_selector: selector, calldata }, "latest"],
    }),
  });
  if (!response.ok) throw new Error(`The RPC answered HTTP ${response.status}.`);
  const body = await response.json();
  if (body.error) throw new Error(`The RPC returned an error: ${body.error.message ?? "unknown"}.`);
  return body.result as string[];
}

function byteArrayToString(felts: string[]) {
  const words = Number(felts[0]);
  let out = "";
  const append = (value: string, bytes: number) => {
    const digits = BigInt(value).toString(16).padStart(bytes * 2, "0");
    for (let i = 0; i < digits.length; i += 2) out += String.fromCharCode(parseInt(digits.slice(i, i + 2), 16));
  };
  for (let i = 0; i < words; i++) append(felts[1 + i], 31);
  const pendingLength = Number(felts[2 + words]);
  if (pendingLength) append(felts[1 + words], pendingLength);
  return out;
}

/** Reads the Beast's Named Song from mainnet: manager and renderer from the registry, then the chain's own segment. */
async function readNamedSegment(beast: Beast, signal: AbortSignal) {
  const species = hex(BigInt(beast.speciesId));
  const registry = manifest.contracts.registry;
  const [[manager], [renderer]] = await Promise.all([
    starknetCall(registry, GET_SOUND_MANAGER, [species], signal),
    starknetCall(registry, GET_RENDERER, [species], signal),
  ]);
  const sound = await starknetCall(manager, GET_TRACK_SOUND, [hex(beast.tokenId), ...TRACK_REF_NAMED], signal);
  // Serde(TinySynthSound) is exactly the calldata of the segment call.
  const encoded = await starknetCall(renderer, TINYSYNTH_MIDI_SEGMENT, sound, signal);
  let segment = "";
  try {
    segment = atob(atob(byteArrayToString(encoded)));
  } catch {
    // Reported below: anything that doesn't decode can't match the segment's shape.
  }
  if (!SEGMENT_SHAPE.test(segment)) throw new Error("The RPC response was not a playable segment.");
  return segment;
}

const liveErrorMessage = (cause: unknown) => {
  if (cause instanceof TypeError) return "Could not reach the mainnet RPC.";
  return cause instanceof Error ? cause.message : "The mainnet read failed.";
};

const fieldClass =
  "w-full rounded-md border border-white/15 bg-[#121212] px-3 py-2 text-sm text-white/90 focus:outline-2 focus:outline-[#46a9f0]";
const buttonClass =
  "rounded-md border border-[#46a9f0]/60 bg-[#46a9f0]/15 px-4 py-2 text-sm font-semibold text-white/90 hover:bg-[#46a9f0]/25 disabled:cursor-not-allowed disabled:opacity-50";

export function BeastMusicPlayer() {
  const [slug, setSlug] = useState(manifest.beasts[4].slug);
  const [trackKey, setTrackKey] = useState("named-song");
  const [source, setSource] = useState<Source>("static");
  const [view, setView] = useState<View>({ status: "idle" });
  const liveRequest = useRef<AbortController | null>(null);

  const beast = manifest.beasts.find((candidate) => candidate.slug === slug) ?? manifest.beasts[0];
  const track = beast.tracks.find((candidate) => candidate.key === trackKey) ?? beast.tracks[0];
  const hasNamed = beast.tracks.some((candidate) => candidate.key === "named-song");

  // Any change of selection drops the current iframe straight away, which stops its audio.
  useEffect(() => {
    liveRequest.current?.abort();
    if (source === "live") {
      setView({ status: "idle" });
      return;
    }
    const controller = new AbortController();
    setView({ status: "loading", message: "Loading the sample" });
    Promise.all([
      fetchText(`${ASSET_BASE}/${beast.slug}/page.txt`, controller.signal),
      fetchText(`${ASSET_BASE}/${beast.slug}/${track.key}.txt`, controller.signal),
    ])
      .then(([page, segment]) => setView({ status: "ready", srcDoc: withSegment(page, segment) }))
      .catch((cause) => {
        if (!controller.signal.aborted) {
          setView({ status: "error", message: cause instanceof Error ? cause.message : "Could not load the sample." });
        }
      });
    return () => controller.abort();
  }, [beast.slug, track.key, source]);

  async function readLive() {
    liveRequest.current?.abort();
    const controller = new AbortController();
    liveRequest.current = controller;
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, RPC_TIMEOUT_MS);
    const started = performance.now();
    setView({ status: "loading", message: `Reading the Named Song of ${beast.name} from mainnet` });
    try {
      const [segment, page] = await Promise.all([
        readNamedSegment(beast, controller.signal),
        fetchText(`${ASSET_BASE}/${beast.slug}/page.txt`, controller.signal),
      ]);
      const seconds = ((performance.now() - started) / 1000).toFixed(1);
      setView({
        status: "ready",
        srcDoc: withSegment(page, segment),
        note: `Read from mainnet just now in ${seconds} s. The card is the captured one; the music is current chain output.`,
      });
    } catch (cause) {
      if (timedOut) setView({ status: "error", message: "Mainnet took too long to answer." });
      else if (!controller.signal.aborted) setView({ status: "error", message: liveErrorMessage(cause) });
    } finally {
      clearTimeout(timer);
    }
  }

  const liveDisabled = source === "live" && !hasNamed;
  const effectsNote =
    track.key === "sound-check" && track.effects.toLowerCase().includes("echo")
      ? " Sound Checks skip the chip echo; the preset still changes their tempo, loudness and articulation."
      : "";

  return (
    <div className="not-prose my-6 rounded-lg border border-white/10 p-4 sm:p-5" data-beast-music-player>
      <div className="grid gap-5 md:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
        <div>
          <div className="relative mx-auto w-full max-w-[340px] overflow-hidden rounded-xl bg-black" style={{ aspectRatio: "250 / 350" }}>
            {view.status === "ready" ? (
              <iframe
                title={`Onchain player for ${beast.name}`}
                srcDoc={view.srcDoc}
                sandbox="allow-scripts"
                referrerPolicy="no-referrer"
                className="absolute inset-0 h-full w-full border-0"
              />
            ) : (
              <img
                src={`${ASSET_BASE}/cards/${beast.slug}.svg`}
                alt={`${beast.name} card`}
                className="absolute inset-0 h-full w-full object-contain"
              />
            )}
          </div>
        </div>

        <div className="min-w-0 space-y-4 text-sm text-white/80">
          <label className="block space-y-1">
            <span className="font-medium text-white/90">Reference Beast</span>
            <select className={fieldClass} value={beast.slug} onChange={(event) => setSlug(event.target.value)}>
              {manifest.beasts.map((candidate) => (
                <option key={candidate.slug} value={candidate.slug}>
                  {candidate.name} ({candidate.role})
                </option>
              ))}
            </select>
          </label>

          <fieldset className="space-y-2">
            <legend className="mb-1 font-medium text-white/90">Where the music comes from</legend>
            <label className="flex items-start gap-2">
              <input type="radio" name="beast-music-source" className="mt-1" checked={source === "static"} onChange={() => setSource("static")} />
              <span>
                Static sample <span className="text-white/60">(committed to this site, no RPC)</span>
              </span>
            </label>
            <label className="flex items-start gap-2">
              <input type="radio" name="beast-music-source" className="mt-1" checked={source === "live"} onChange={() => setSource("live")} />
              <span>
                Live mode <span className="text-white/60">(reads the Named Song from mainnet now)</span>
              </span>
            </label>
          </fieldset>

          {source === "static" ? (
            <div className="space-y-2">
              <label className="block space-y-1">
                <span className="font-medium text-white/90">Track</span>
                <select className={fieldClass} value={track.key} onChange={(event) => setTrackKey(event.target.value)}>
                  {beast.tracks.map((candidate) => (
                    <option key={candidate.key} value={candidate.key}>
                      {candidate.label}
                    </option>
                  ))}
                </select>
              </label>
              {!hasNamed && <p className="text-white/60">Genesis Beasts have no Named Song.</p>}
              <p className="text-white/60">
                Sound mode: {track.mode}. Effects: {track.effects} ({track.effectsFrom === "token" ? "from the token" : "King-controlled"}).{effectsNote}{" "}
                Captured at block {manifest.capture.block.toLocaleString("en-US")} ({manifest.capture.date}).
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <button type="button" className={buttonClass} disabled={liveDisabled || view.status === "loading"} onClick={readLive}>
                Read Named Song from mainnet
              </button>
              {liveDisabled ? (
                <p className="text-white/60">Live mode is off for this Beast: Genesis Beasts have no Named Song. Choose a named Beast, or use a static sample.</p>
              ) : (
                <p className="text-white/60">This control only changes where the data comes from. It is separate from the Live sound mode described on this page.</p>
              )}
            </div>
          )}

          <div aria-live="polite" className="min-h-6">
            {view.status === "loading" && <p className="text-white/70">{view.message}…</p>}
            {view.status === "ready" && <p className="text-white/70">Ready. Press play on the card.{view.note ? ` ${view.note}` : ""}</p>}
            {view.status === "error" && (
              <div role="alert" className="space-y-2">
                <p className="text-[#ff9b9b]">
                  {view.message}
                  {source === "live" ? " The static samples and the rest of this page still work." : ""}
                </p>
                {source === "live" && (
                  <button type="button" className={buttonClass} onClick={readLive}>
                    Retry
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
