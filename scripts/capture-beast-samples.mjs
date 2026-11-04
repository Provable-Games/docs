#!/usr/bin/env node
/**
 * Captures the Beast music samples used by /lootsurvivor/beasts/music and the example cards used
 * by /lootsurvivor/beasts/collectibles, from Starknet mainnet at one pinned block, with read-only
 * JSON-RPC calls. Tokens are listed in scripts/beast-sample-tokens.json.
 *
 * Usage:
 *   node scripts/capture-beast-samples.mjs [block]
 *
 * Optional env: STARKNET_RPC (defaults to the public Provable Games endpoint).
 *
 * Output under src/public/docs/lootsurvivor/beast-music/ (NOTICE.txt and LICENSE are kept):
 *   shell-plain.txt, shell-notes.txt   the player page with one token's data taken out
 *   card-parts.json                    SVG pieces that two or more cards share
 *   settings/<sha>.txt, midi/<sha>.txt synth settings and base64 MIDI, by content hash
 *   tokens/<slug>.json                 one token: card, whitespace runs, tracks and hashes
 *   cards/<slug>.svg                   images for the Collectibles page, byte for byte
 * and src/components/beastMusicManifest.json, the small index bundled with the player.
 *
 * Nothing is synthesised. The capture aborts unless, for every token:
 *   - the page rebuilt by src/components/beastMusicAssemble.ts equals its `animation_url`, byte for byte
 *   - each track's rebuilt segment equals the renderer's `tinysynth_midi_segment` output
 *   - every track reads SoundMode Original from the chain, and the Named Song's bytes equal
 *     `preview_inputs` in Original (a purchased track in another mode is left out and logged)
 * Files are .txt or .json so they can never run as same-origin pages on the docs site; the player
 * only ever puts the assembled page in a sandboxed iframe.
 */
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { assembleCard, assemblePage, assembleSegment, CARD, GAP, SEGMENT } from "../src/components/beastMusicAssemble.ts";

const RPC = process.env.STARKNET_RPC ?? "https://rpc.provable.games/rpc";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "src/public/docs/lootsurvivor/beast-music");
const MANIFEST = join(ROOT, "src/components/beastMusicManifest.json");

const NFT = "0xf739e402e52830a736335a0f47d58ec78ba067443c9c6930da182eab2ff8b0";
const REGISTRY = "0x140e8868c7c9277b8b864d78efb5172a42d41e0b501329b043db7d2cb3bc8b3";

// starknet_keccak of each entrypoint name.
const SEL = {
  token_uri: "0x226ad7e84c1fe08eb4c525ed93cccadf9517670341304571e66f7c4f95cbe54",
  get_sound_manager: "0x34d438ea14db03e0875aa336abaab18e382738c77f4a45e990597a51f5f6747",
  get_renderer: "0xc848504e5371922a1ab98cbd2b0593ee3746ff989e8941a897b15eb343a370",
  get_track_sound: "0x304c6a9604c44d757c3d71d2a90796a89cf32bfb9126f6701923532c68fb4f9",
  get_track_counts: "0x285bdef2724568a5c84d1f9cde55fb09e0c986e4b23be958b5ffbc8f9e3f616",
  get_beast: "0x385b69551f247794fe651459651cdabc76b6cdf4abacafb5b28ceb3b1ac2e98",
  get_track_inputs: "0x35a3a9ec7323772ebff4e60f4134b2754d5e34ff2ffc265a4071a79931bfe0f",
  preview_inputs: "0x1ff9274a14583b2cc51bca3825af94e7c59c6b657cd06b15ec33f0aef304a",
  get_named_song_birth: "0xf2f241881b54079472cdd201964d0d490c1b460543c257768904130a120c33",
  get_track_sound_mode: "0x220ba129a0aa06bf9480d216508e4909941a128b9b801a669e9e02a4e0ec9aa",
  get_individual_tracks: "0xf17438e5301f9c445514402b0ec236cc8e7a7f84a273ab9421536ce2db735b",
  get_shared_song_mode: "0x2e0eead844cc18d713de88e29fabd58b00997564ed43298a975b7724cc7cbe0",
  get_shared_song_preset: "0x34976e616517612df5190b9cc73a632e7f80ef0a4335e5dc2f1d2c96d16965f",
  tinysynth_midi_segment: "0x26263beb2ea712ee2b32f7a5d96d8f044d80d923bc5a1aaf93eaa92470d688b",
};

const RARITIES = ["Regular", "Shiny", "MIDI", "Shiny + MIDI"];
const LIST = JSON.parse(readFileSync(join(ROOT, "scripts/beast-sample-tokens.json"), "utf8"));

const EFFECT_NAMES = ["Written", "Mega", "Echo", "Mega + echo"];
const SETTINGS_OPEN = '<script type="text/plain" id="onchain-midi-settings">';
const hex = (v) => "0x" + BigInt(v).toString(16);
const sha256 = (data) => createHash("sha256").update(data).digest("hex");

let rpcId = 1;
async function rpc(method, params) {
  const res = await fetch(RPC, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: rpcId++, method, params }),
  });
  if (!res.ok) throw new Error(`${method}: HTTP ${res.status}`);
  const body = await res.json();
  if (body.error) throw new Error(`${method}: ${JSON.stringify(body.error).slice(0, 300)}`);
  return body.result;
}

function byteArrayToBuffer(felts) {
  const f = felts.map(BigInt);
  const words = Number(f[0]);
  let out = "";
  for (let i = 0; i < words; i++) out += f[1 + i].toString(16).padStart(62, "0");
  const pendingLen = Number(f[2 + words]);
  if (pendingLen) out += f[1 + words].toString(16).padStart(pendingLen * 2, "0");
  if (f.length !== 3 + words) throw new Error("trailing felts after ByteArray");
  return Buffer.from(out, "hex");
}

/** Independent decode of a Serde TinySynthSound into the page's two inert blocks. */
function decodeSound(felts) {
  const P = (1n << 251n) + 17n * (1n << 192n) + 1n;
  const f = felts.map(BigInt);
  let i = 0;
  const next = () => f[i++];
  const num = () => Number(next());
  const int = () => {
    const v = next();
    return (v > P / 2n ? v - P : v).toString();
  };
  const words = num();
  let midiHex = "";
  for (let w = 0; w < words; w++) midiHex += next().toString(16).padStart(62, "0");
  const pending = next();
  const pendingLen = num();
  if (pendingLen) midiHex += pending.toString(16).padStart(pendingLen * 2, "0");

  const out = ["1", num(), num(), num(), num()].map(String); // version, quality, reverb, master, voices
  const waves = num();
  out.push(String(waves));
  for (let w = 0; w < waves; w++) {
    const tag = num();
    const len = num();
    out.push(String(tag), String(len));
    for (let k = 0; k < len; k++) out.push(tag === 0 ? String(num()) : int());
  }
  const timbres = num();
  out.push(String(timbres));
  for (let t = 0; t < timbres; t++) {
    out.push(String(num()), String(num()));
    const ops = num();
    out.push(String(ops));
    for (let o = 0; o < ops; o++) {
      out.push(String(num()));
      const wave = num();
      out.push(String(wave));
      if (wave === 6) out.push(String(num()));
      // volume, ratio, offset_hz (signed), attack, hold, decay, sustain, release, pitch_ratio, pitch_time, key_scale (signed)
      for (const signed of [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1]) out.push(signed ? int() : String(num()));
      if (num() === 0) out.push("1", String(num()), String(num()), String(num()), String(num()));
      else out.push("0");
    }
  }
  if (i !== f.length) throw new Error(`decodeSound consumed ${i} of ${f.length} felts`);
  return { midi: Buffer.from(midiHex, "hex"), settings: out.join(",") };
}

const decodeMode = (felts) => {
  const tag = Number(felts[0]);
  return tag === 0 ? "Live" : tag === 1 ? "Original" : `AtBlock ${BigInt(felts[1])}`;
};

const blockNumber = process.argv[2] ? Number(process.argv[2]) : await rpc("starknet_blockNumber", []);
const blockId = { block_number: blockNumber };
const header = await rpc("starknet_getBlockWithTxHashes", [blockId]);
const call = (contract_address, entry_point_selector, calldata) =>
  rpc("starknet_call", [{ contract_address, entry_point_selector, calldata }, blockId]);

async function readToken(tokenId) {
  const id = BigInt(tokenId);
  const uri = byteArrayToBuffer(await call(NFT, SEL.token_uri, [hex(id & ((1n << 128n) - 1n)), hex(id >> 128n)])).toString("latin1");
  const meta = JSON.parse(Buffer.from(uri.split(",")[1], "base64").toString("utf8"));
  return {
    traits: Object.fromEntries(meta.attributes.map((a) => [a.trait_type, a.value])),
    svg: Buffer.from(meta.image.split(",")[1], "base64"),
    page: Buffer.from(meta.animation_url.split(",")[1], "base64"),
  };
}

const speciesRoutes = new Map();
async function routes(species) {
  if (!speciesRoutes.has(species)) {
    const [manager] = await call(REGISTRY, SEL.get_sound_manager, [hex(species)]);
    const [renderer] = await call(REGISTRY, SEL.get_renderer, [hex(species)]);
    const [birth] = await call(manager, SEL.get_named_song_birth, []);
    speciesRoutes.set(species, { manager, renderer, birth });
  }
  return speciesRoutes.get(species);
}

const ART_ATTR = 'src="data:image/svg+xml;base64,';
const evidence = { tracks: 0, original: 0, excluded: [], namedOriginalMatchesPreview: 0, namedLiveDiffers: 0, namedLiveSame: [] };
const contentFiles = new Map(); // path -> text
const stored = (dir, text) => {
  const name = sha256(text).slice(0, 16);
  contentFiles.set(`${dir}/${name}.txt`, text);
  return name;
};

async function captureToken(tokenId, slug, expectedPreset) {
  const hexId = hex(tokenId);
  const { traits, svg, page } = await readToken(tokenId);
  const species = Number(traits["Species ID"]);
  const preset = Number(traits["Visual Effects"]);
  if (preset !== expectedPreset || Number(traits["Sound Effects"]) !== preset) throw new Error(`${slug}: expected preset ${expectedPreset}, found ${preset}/${traits["Sound Effects"]}`);
  const [, prefix, suffix] = (await call(NFT, SEL.get_beast, [hexId])).map(Number);
  if (!prefix || !suffix) throw new Error(`${slug}: expected a named Beast`);
  const nameVariant = (prefix - 1) * 18 + suffix;
  const { manager, renderer, birth } = await routes(species);
  const [shared, named, individual] = (await call(manager, SEL.get_track_counts, [hexId])).map(Number);
  if (shared !== 2 || named !== 1) throw new Error(`${slug}: expected 2 shared and 1 named track, found ${shared}/${named}`);

  const refs = [
    { key: "sound-check", label: "Sound Check", kind: "shared", calldata: ["0x0", "0x0"] },
    { key: "species-song", label: "Species Song", kind: "shared-song", calldata: ["0x0", "0x1"] },
    { key: "named-song", label: "Named Song", kind: "named", calldata: ["0x2"] },
  ];
  for (let n = 0; n < individual; n++) refs.push({ key: `purchased-${n}`, label: `Purchased Track ${n + 1}`, kind: "individual", n, calldata: ["0x1", hex(n)] });

  const pageText = page.toString("latin1");
  const tracks = [];
  let shellSegment = null;
  for (const ref of refs) {
    evidence.tracks++;
    // The track's own mode, from the chain.
    const mode = decodeMode(await call(manager, SEL.get_track_sound_mode, [hexId, ...ref.calldata]));
    const songMode = ref.kind === "shared-song" ? decodeMode(await call(manager, SEL.get_shared_song_mode, [hex(species), "0x1"])) : mode;
    if (mode !== "Original" || songMode !== "Original") {
      if (ref.kind !== "individual") throw new Error(`${slug}/${ref.key}: SoundMode ${mode}/${songMode}, expected Original`);
      evidence.excluded.push(`${slug}/${ref.key}: ${mode}`);
      continue;
    }
    evidence.original++;

    const raw = await call(manager, SEL.get_track_sound, [hexId, ...ref.calldata]);
    const sound = decodeSound(raw);
    const onceEncoded = byteArrayToBuffer(await call(renderer, SEL.tinysynth_midi_segment, raw));
    const segment = Buffer.from(Buffer.from(onceEncoded.toString("latin1"), "base64").toString("latin1"), "base64").toString("latin1");

    if (ref.kind === "named") {
      const inputs = await call(manager, SEL.get_track_inputs, [hexId, "0x2"]);
      const preview = (m) => call(manager, SEL.preview_inputs, [...inputs, hex(preset), birth, hex(nameVariant), m]);
      const same = (a, b) => a.length === b.length && a.every((felt, i) => BigInt(felt) === BigInt(b[i]));
      if (!same(await preview("0x1"), raw)) throw new Error(`${slug}: Named Song differs from preview_inputs in Original`);
      evidence.namedOriginalMatchesPreview++;
      if (same(await preview("0x0"), raw)) evidence.namedLiveSame.push(slug);
      else evidence.namedLiveDiffers++;
    }

    const midiBase64 = sound.midi.toString("base64");
    const body = assembleSegment(sound.settings, midiBase64, 0);
    if (!segment.startsWith(body) || segment.slice(body.length).trim() !== "") throw new Error(`${slug}/${ref.key}: decoder disagrees with the chain segment`);
    const padding = segment.length - body.length;
    if (assembleSegment(sound.settings, midiBase64, padding) !== segment) throw new Error(`${slug}/${ref.key}: segment does not rebuild`);
    if (pageText.includes(segment) && !shellSegment) shellSegment = { key: ref.key, segment };

    const track = {
      key: ref.key,
      label: ref.label,
      mode,
      settings: stored("settings", sound.settings),
      midi: stored("midi", midiBase64),
      padding,
      midiBytes: sound.midi.length,
      midiSha256: sha256(sound.midi),
      segmentSha256: sha256(Buffer.from(segment, "latin1")),
    };
    if (ref.kind === "shared-song") {
      track.effects = EFFECT_NAMES[Number((await call(manager, SEL.get_shared_song_preset, [hex(species), "0x1"]))[0])];
      track.effectsFrom = "King-controlled";
    } else {
      track.effects = EFFECT_NAMES[preset];
      track.effectsFrom = "token";
    }
    if (ref.kind === "individual") {
      // Page<IndividualTrackRecord>: total, next_start option, items length, then id, purchase_block,
      // ready_at, binding (2 felts), edition_id, ...
      const listing = await call(manager, SEL.get_individual_tracks, [hexId, hex(ref.n), "0x1"]);
      const record = listing.slice(Number(listing[1]) === 0 ? 4 : 3);
      const edition = Number(record[5]);
      track.edition = edition;
      track.label = edition === 0 ? `Purchased Song ${ref.n + 1}` : `Purchased Edition ${edition} (#${ref.n + 1})`;
    }
    tracks.push(track);
  }
  if (!shellSegment) throw new Error(`${slug}: the page embeds none of the captured tracks`);

  // Split the page into a shareable shell and this token's own data.
  const cardBase64 = svg.toString("base64");
  const artAt = pageText.indexOf(ART_ATTR + cardBase64);
  const segmentAt = pageText.indexOf(shellSegment.segment);
  if (artAt < 0 || segmentAt < artAt) throw new Error(`${slug}: unexpected page layout`);
  const cardStart = artAt + ART_ATTR.length;
  const gaps = [];
  // Word-alignment filler around the art and music can be any length, including none. Runs inside
  // the head and footer are matched too, which is harmless: they just repeat for every token.
  const blank = (text) => text.replace(/ *(?=<script id="beast-(?:notes|bootstrap)">)| {2,}/g, (run) => (gaps.push(run.length), GAP));
  const lead = (text) => {
    const run = text.match(/^ */)[0];
    gaps.push(run.length);
    return GAP + blank(text.slice(run.length));
  };
  const tail = (text) => {
    const run = text.match(/ *$/)[0];
    const body = blank(text.slice(0, text.length - run.length));
    gaps.push(run.length);
    return body + GAP;
  };
  const afterCard = pageText.slice(cardStart + cardBase64.length, segmentAt);
  const closing = afterCard.match(/^" *>/);
  if (!closing) throw new Error(`${slug}: unexpected markup after the art`);
  const head = blank(pageText.slice(0, cardStart));
  gaps.push(closing[0].length - 2);
  const shell =
    head +
    CARD +
    `"${GAP}>` +
    tail(afterCard.slice(closing[0].length)) +
    SEGMENT +
    lead(pageText.slice(segmentAt + shellSegment.segment.length));

  const name = `"${traits.Prefix} ${traits.Suffix}" ${traits.Beast}`;
  console.log(`${slug}: ${name} ${tokenId} grade ${traits["Card Grade"]} rank ${traits.Rank} tracks ${tracks.map((t) => `${t.key}=${t.mode}`).join(",")}`);
  return {
    slug,
    tokenId,
    name,
    species,
    beast: traits.Beast,
    type: traits.Type,
    tier: Number(traits.Tier),
    preset,
    rarity: RARITIES[preset],
    nameVariant,
    grade: Number(traits["Card Grade"]),
    rank: Number(traits.Rank),
    selected: shellSegment.key,
    gaps,
    tracks,
    shell,
    svg,
    page,
  };
}

const tokens = [];
for (const entry of LIST.beasts) {
  for (const [preset, tokenId] of entry.tokens.entries()) {
    const speciesSlug = String(entry.species);
    tokens.push(await captureToken(tokenId, `${speciesSlug}-${preset}`, preset));
  }
}

// Shells: one per kind of page, and they must be the same for every token of that kind.
const shells = { plain: null, notes: null };
for (const token of tokens) {
  const kind = token.preset >= 2 ? "notes" : "plain";
  if (shells[kind] === null) shells[kind] = token.shell;
  if (shells[kind] !== token.shell) {
    let at = 0;
    while (shells[kind][at] === token.shell[at]) at++;
    throw new Error(`${token.slug}: its ${kind} shell differs at ${at}: ${JSON.stringify(token.shell.slice(at - 60, at + 60))} vs ${JSON.stringify(shells[kind].slice(at - 60, at + 60))}`);
  }
  token.shellKind = kind;
}

// Card pieces that at least two cards share.
const splitCard = (svg) => svg.toString("latin1").match(/<[^>]*>[^<]*|[^<]+/g);
const counts = new Map();
for (const token of tokens) for (const part of new Set(splitCard(token.svg))) counts.set(part, (counts.get(part) ?? 0) + 1);
const sharedParts = [...counts].filter(([part, count]) => count > 1 && part.length > 24).map(([part]) => part);
const partIndex = new Map(sharedParts.map((part, index) => [part, index]));

// Write, after proving every rebuilt page and card against the chain's bytes.
for (const dir of ["cards", "tokens", "settings", "midi"]) rmSync(join(OUT, dir), { recursive: true, force: true });
rmSync(MANIFEST, { force: true });
for (const dir of ["cards", "tokens", "settings", "midi"]) mkdirSync(join(OUT, dir), { recursive: true });
writeFileSync(join(OUT, "shell-plain.txt"), shells.plain);
writeFileSync(join(OUT, "shell-notes.txt"), shells.notes);
writeFileSync(join(OUT, "card-parts.json"), JSON.stringify(sharedParts));
for (const [path, text] of contentFiles) writeFileSync(join(OUT, path), text);

let proven = 0;
const index = new Map();
for (const token of tokens) {
  const parts = splitCard(token.svg).map((part) => partIndex.get(part) ?? part);
  const card = assembleCard(parts, sharedParts);
  if (card !== token.svg.toString("latin1")) throw new Error(`${token.slug}: card does not rebuild`);
  const selected = token.tracks.find((track) => track.key === token.selected);
  const segment = assembleSegment(contentFiles.get(`settings/${selected.settings}.txt`), contentFiles.get(`midi/${selected.midi}.txt`), selected.padding);
  const rebuilt = assemblePage(shells[token.shellKind], token.gaps, card, segment);
  if (sha256(Buffer.from(rebuilt, "latin1")) !== sha256(token.page)) throw new Error(`${token.slug}: rebuilt page is not the chain's animation_url`);
  proven++;

  const beastSlug = token.beast.toLowerCase().replace(/[^a-z]+/g, "-");
  const presetSlug = RARITIES[token.preset].toLowerCase().replace(/[^a-z]+/g, "-");
  const slug = `${beastSlug}-${presetSlug}`;
  writeFileSync(
    join(OUT, "tokens", `${slug}.json`),
    JSON.stringify({
      tokenId: token.tokenId,
      name: token.name,
      species: token.species,
      preset: token.preset,
      nameVariant: token.nameVariant,
      shell: token.shellKind,
      selected: token.selected,
      gaps: token.gaps,
      card: parts,
      pageSha256: sha256(token.page),
      tracks: token.tracks,
    }),
  );
  if (token.species === 1) writeFileSync(join(OUT, "cards", `${slug}.svg`), token.svg);

  if (!index.has(token.species)) index.set(token.species, { name: token.beast, type: token.type, tier: token.tier, rarities: [] });
  const entry = { slug, name: token.name, rarity: token.rarity, grade: token.grade, rank: token.rank };
  const purchased = token.tracks.filter((track) => track.key.startsWith("purchased-")).map(({ key, label }) => ({ key, label }));
  if (purchased.length) entry.purchased = purchased;
  index.get(token.species).rarities.push(entry);
}

for (const { slug, tokenId } of LIST.cardOnly) writeFileSync(join(OUT, "cards", `${slug}.svg`), (await readToken(tokenId)).svg);

const first = speciesRoutes.get(1);
const manifest = {
  capture: { block: blockNumber, date: new Date(header.timestamp * 1000).toISOString().slice(0, 10) },
  contracts: { nft: NFT, registry: REGISTRY, soundManager: first.manager, renderer: first.renderer },
  beasts: [...index.values()],
};
writeFileSync(MANIFEST, JSON.stringify(manifest) + "\n");

console.log(`Captured ${tokens.length} tokens at block ${blockNumber} (${manifest.capture.date}).`);
console.log(`Pages rebuilt byte-identical to animation_url: ${proven}/${tokens.length}`);
console.log(`Tracks: ${evidence.tracks}; SoundMode Original on chain: ${evidence.original}; excluded: ${evidence.excluded.length ? evidence.excluded.join(", ") : "none"}`);
console.log(`Named Song equals preview_inputs(Original): ${evidence.namedOriginalMatchesPreview}/${tokens.length}`);
console.log(`Named Song differs in preview_inputs(Live): ${evidence.namedLiveDiffers}/${tokens.length}${evidence.namedLiveSame.length ? `; same: ${evidence.namedLiveSame.join(", ")}` : ""}`);
