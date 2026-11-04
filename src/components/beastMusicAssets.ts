import { assembleCard, assemblePage, assembleSegment } from "./beastMusicAssemble";
import manifest from "./beastMusicManifest.json";

/**
 * Loads Beast player pages. Original tracks are assembled from same-origin files captured from
 * mainnet. Live Named Songs are read from mainnet in the browser, without changing anything.
 * Everything loaded stays in memory for the page session. A failure is not kept, so Retry works.
 */

const RPC_URL = "https://rpc.provable.games/rpc";
const RPC_TIMEOUT_MS = 30_000;
const BASE = "/docs/lootsurvivor/beast-music";

// starknet_keccak of each entrypoint name.
const GET_SOUND_MANAGER = "0x34d438ea14db03e0875aa336abaab18e382738c77f4a45e990597a51f5f6747";
const GET_RENDERER = "0xc848504e5371922a1ab98cbd2b0593ee3746ff989e8941a897b15eb343a370";
const GET_NAMED_SONG_BIRTH = "0xf2f241881b54079472cdd201964d0d490c1b460543c257768904130a120c33";
const GET_TRACK_INPUTS = "0x35a3a9ec7323772ebff4e60f4134b2754d5e34ff2ffc265a4071a79931bfe0f";
const PREVIEW_INPUTS = "0x1ff9274a14583b2cc51bca3825af94e7c59c6b657cd06b15ec33f0aef304a";
const TINYSYNTH_MIDI_SEGMENT = "0x26263beb2ea712ee2b32f7a5d96d8f044d80d923bc5a1aaf93eaa92470d688b";
const TRACK_REF_NAMED = "0x2"; // TrackRef::Named, a unit variant
const SOUND_MODE_LIVE = "0x0"; // SoundMode::Live

const SEGMENT_SHAPE =
  /^<script type="text\/plain" id="onchain-midi-settings">[-0-9,]+<\/script><script type="text\/plain" id="onchain-midi-data">[A-Za-z0-9+/=]+<\/script>\s*$/;

export type Track = {
  key: string;
  label: string;
  mode: string;
  effects: string;
  effectsFrom: string;
  settings: string;
  midi: string;
  padding: number;
};

export type TokenAssets = {
  tokenId: string;
  name: string;
  species: number;
  preset: number;
  nameVariant: number;
  shell: "plain" | "notes";
  gaps: number[];
  card: Array<string | number>;
  tracks: Track[];
};

const cache = new Map<string, Promise<unknown>>();

function once<T>(key: string, load: () => Promise<T>): Promise<T> {
  const existing = cache.get(key) as Promise<T> | undefined;
  if (existing) return existing;
  const pending = load();
  cache.set(key, pending);
  pending.catch(() => cache.delete(key));
  return pending;
}

async function fetchFile(path: string) {
  const response = await fetch(`${BASE}/${path}`);
  if (!response.ok) throw new Error(`Could not load ${path} (HTTP ${response.status}).`);
  return response.text();
}

const text = (path: string) => once(`file:${path}`, () => fetchFile(path));
const json = <T,>(path: string) => once(`json:${path}`, async () => JSON.parse(await fetchFile(path)) as T);

export const loadToken = (slug: string) => json<TokenAssets>(`tokens/${slug}.json`);

async function cardFor(token: TokenAssets) {
  return assembleCard(token.card, await json<string[]>("card-parts.json"));
}

async function pageWith(token: TokenAssets, segment: string) {
  const [shell, card] = await Promise.all([text(`shell-${token.shell}.txt`), cardFor(token)]);
  return assemblePage(shell, token.gaps, card, segment);
}

/** The token's player page with one of its tracks, as recorded in SoundMode Original. */
export function loadOriginalPage(slug: string, trackKey: string) {
  return once(`original:${slug}:${trackKey}`, async () => {
    const token = await loadToken(slug);
    const track = token.tracks.find((candidate) => candidate.key === trackKey) ?? token.tracks[0];
    const [settings, midi] = await Promise.all([text(`settings/${track.settings}.txt`), text(`midi/${track.midi}.txt`)]);
    return pageWith(token, assembleSegment(settings, midi, track.padding));
  });
}

const hex = (value: string | number | bigint) => "0x" + BigInt(value).toString(16);

async function starknetCall(contract: string, selector: string, calldata: string[]) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), RPC_TIMEOUT_MS);
  try {
    const response = await fetch(RPC_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      signal: controller.signal,
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
  } catch (cause) {
    if (controller.signal.aborted) throw new Error("Mainnet took too long to answer.");
    if (cause instanceof TypeError) throw new Error("Could not reach the mainnet RPC.");
    throw cause;
  } finally {
    clearTimeout(timer);
  }
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

/** One nonzero felt, or an error: a wrong answer must never be kept. */
async function readFelt(contract: string, selector: string, calldata: string[]) {
  const result = await starknetCall(contract, selector, calldata);
  if (result.length !== 1 || BigInt(result[0]) === 0n) throw new Error("The RPC response was not a playable segment.");
  return result[0];
}

const managerKey = (species: number) => `manager:${species}`;
const rendererKey = (species: number) => `renderer:${species}`;
const birthKey = (address: string) => `birth:${address}`;
const manager = (species: number) => once(managerKey(species), () => readFelt(manifest.contracts.registry, GET_SOUND_MANAGER, [hex(species)]));
const renderer = (species: number) => once(rendererKey(species), () => readFelt(manifest.contracts.registry, GET_RENDERER, [hex(species)]));
const namedBirth = (address: string) => once(birthKey(address), () => readFelt(address, GET_NAMED_SONG_BIRTH, []));

/**
 * Reads the token's Named Song in SoundMode Live. `preview_inputs` is a view: it composes with the
 * same inputs, effects and context that `get_track_sound` uses for a Named Song set to Live, and it
 * changes no selection or setting. The renderer then writes the segment the token's page would hold.
 */
export function loadLivePage(slug: string) {
  return once(`live:${slug}`, async () => {
    const token = await loadToken(slug);
    let managerAddress = "";
    try {
      managerAddress = await manager(token.species);
      const rendererAddress = await renderer(token.species);
      const birth = await namedBirth(managerAddress);
      const inputs = await once(`inputs:${slug}`, () => starknetCall(managerAddress, GET_TRACK_INPUTS, [hex(token.tokenId), TRACK_REF_NAMED]));
      const sound = await starknetCall(managerAddress, PREVIEW_INPUTS, [...inputs, hex(token.preset), birth, hex(token.nameVariant), SOUND_MODE_LIVE]);
      // Serde(TinySynthSound) is exactly the calldata of the segment call.
      const encoded = await starknetCall(rendererAddress, TINYSYNTH_MIDI_SEGMENT, sound);
      let segment = "";
      try {
        segment = atob(atob(byteArrayToString(encoded)));
      } catch {
        // Reported below: anything that doesn't decode can't match the segment's shape.
      }
      if (!SEGMENT_SHAPE.test(segment)) throw new Error("The RPC response was not a playable segment.");
      return await pageWith(token, segment);
    } catch (cause) {
      // A bad answer can look valid until a later call fails, so Retry starts this read over.
      for (const key of [managerKey(token.species), rendererKey(token.species), birthKey(managerAddress), `inputs:${slug}`]) cache.delete(key);
      throw cause;
    }
  });
}
