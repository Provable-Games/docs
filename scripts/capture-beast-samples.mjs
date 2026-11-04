#!/usr/bin/env node
/**
 * Captures the Beast music samples and example cards used by /lootsurvivor/beasts/music
 * from Starknet mainnet, at one pinned block, with read-only JSON-RPC calls.
 *
 * Usage:
 *   node scripts/capture-beast-samples.mjs [block]
 *
 * Optional env: STARKNET_RPC (defaults to the public Provable Games endpoint).
 *
 * What gets written under src/public/docs/lootsurvivor/beast-music/:
 *   cards/<slug>.svg        the token's metadata `image`, byte for byte
 *   <slug>/page.txt         the token's `animation_url` page, decoded, byte for byte
 *   <slug>/<track>.txt      the renderer's own tinysynth_midi_segment output for that track
 *
 * and src/components/beastMusicManifest.json: capture block, contracts, tracks and hashes
 * (imported by the player, so it is not a public asset).
 *
 * Nothing here is synthesised or re-encoded: every file is chain output, base64-decoded.
 * Pages and segments are .txt so they can never run as same-origin pages on the docs site;
 * the player only ever puts them in a sandboxed iframe.
 *
 * The small decoder below is an independent check, not the source of the samples. It must
 * reproduce each segment's blocks from get_track_sound, or the capture aborts.
 */
import { createHash } from "node:crypto";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

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
  get_track_sound_mode: "0x220ba129a0aa06bf9480d216508e4909941a128b9b801a669e9e02a4e0ec9aa",
  get_individual_tracks: "0xf17438e5301f9c445514402b0ec236cc8e7a7f84a273ab9421536ce2db735b",
  get_shared_song_mode: "0x2e0eead844cc18d713de88e29fabd58b00997564ed43298a975b7724cc7cbe0",
  get_shared_song_preset: "0x34976e616517612df5190b9cc73a632e7f80ef0a4335e5dc2f1d2c96d16965f",
  tinysynth_midi_segment: "0x26263beb2ea712ee2b32f7a5d96d8f044d80d923bc5a1aaf93eaa92470d688b",
};

const BEASTS = [
  { slug: "genesis-warlock", role: "Genesis", id: "947810826190769320837858821737753470652770173935338384837652250624" },
  { slug: "gloom-shadow-warlock", role: "Regular", id: "947833927173332754261423897567498916256629074254081657670519128847" },
  { slug: "wrath-bane-warlock", role: "Shiny", id: "947826896832528324890603807747113870591355288299816018771018891435" },
  { slug: "armageddon-growl-warlock", role: "MIDI", id: "947829708249244366760431565815325961877289817362008620300144132267" },
  { slug: "dusk-root-warlock", role: "Shiny + MIDI", id: "947815045188325454773795971956342143321663163700628410504256521537" },
  { slug: "woe-peak-minotaur", role: "Lower grade, Beast Mode", id: "25393433559843487302423503000384220863444752981348771839542211477686" },
];

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

for (const dir of ["cards", ...BEASTS.map((beast) => beast.slug)]) rmSync(join(OUT, dir), { recursive: true, force: true }); // keeps NOTICE.txt and the licence
mkdirSync(join(OUT, "cards"), { recursive: true });

const manifest = {
  note: "Read-only capture from Starknet mainnet by scripts/capture-beast-samples.mjs. Static samples are chain output and can age: holders buy tracks, the King changes Species Song settings, and rankings move.",
  capture: { block: blockNumber, timestamp: header.timestamp, date: new Date(header.timestamp * 1000).toISOString().slice(0, 10) },
  contracts: { nft: NFT, registry: REGISTRY },
  beasts: [],
};

const speciesCache = new Map();
for (const beast of BEASTS) {
  const id = BigInt(beast.id);
  const low = id & ((1n << 128n) - 1n);
  const high = id >> 128n;
  const uri = byteArrayToBuffer(await call(NFT, SEL.token_uri, [hex(low), hex(high)])).toString("latin1");
  const meta = JSON.parse(Buffer.from(uri.split(",")[1], "base64").toString("utf8"));
  const traits = Object.fromEntries(meta.attributes.map((a) => [a.trait_type, a.value]));
  const species = Number(traits["Species ID"]);
  const svg = Buffer.from(meta.image.split(",")[1], "base64");
  const page = Buffer.from(meta.animation_url.split(",")[1], "base64");
  new TextDecoder("utf-8", { fatal: true }).decode(page); // page.txt must survive fetch().text()
  if (!page.includes(SETTINGS_OPEN)) throw new Error(`${beast.slug}: page has no settings block`);

  if (!speciesCache.has(species)) {
    const [manager] = await call(REGISTRY, SEL.get_sound_manager, [hex(species)]);
    const [renderer] = await call(REGISTRY, SEL.get_renderer, [hex(species)]);
    speciesCache.set(species, { manager, renderer });
  }
  const { manager, renderer } = speciesCache.get(species);

  const dir = join(OUT, beast.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(OUT, "cards", `${beast.slug}.svg`), svg);
  writeFileSync(join(dir, "page.txt"), page);

  const [shared, named, individual] = (await call(manager, SEL.get_track_counts, [hex(id)])).map(Number);
  const refs = [
    { key: "sound-check", label: "Sound Check", kind: "shared", calldata: ["0x0", "0x0"] },
    { key: "species-song", label: "Species Song", kind: "shared-song", calldata: ["0x0", "0x1"] },
  ];
  if (named) refs.push({ key: "named-song", label: "Named Song", kind: "named", calldata: ["0x2"] });
  for (let n = 0; n < individual; n++) refs.push({ key: `purchased-${n}`, kind: "individual", n, calldata: ["0x1", hex(n)] });
  if (shared !== 2) throw new Error(`${beast.slug}: expected 2 shared tracks, found ${shared}`);

  if (!named) {
    // Genesis: confirm the chain really refuses, so the page's disabled state stays honest.
    const refused = await call(manager, SEL.get_track_sound, [hex(id), "0x2"]).then(() => false, () => true);
    if (!refused) throw new Error(`${beast.slug}: expected Named to revert`);
  }

  const effects = Number(traits["Sound Effects"]);
  const tracks = [];
  for (const ref of refs) {
    const raw = await call(manager, SEL.get_track_sound, [hex(id), ...ref.calldata]);
    const onceEncoded = byteArrayToBuffer(await call(renderer, SEL.tinysynth_midi_segment, raw));
    const segment = Buffer.from(Buffer.from(onceEncoded.toString("latin1"), "base64").toString("latin1"), "base64");

    const sound = decodeSound(raw);
    const expected = `${SETTINGS_OPEN}${sound.settings}</script><script type="text/plain" id="onchain-midi-data">${sound.midi.toString("base64")}</script>`;
    if (!segment.toString("latin1").startsWith(expected)) throw new Error(`${beast.slug}/${ref.key}: decoder disagrees with the chain segment`);
    if (ref.key === "sound-check" && !page.includes(segment)) throw new Error(`${beast.slug}: token page does not embed the Sound Check segment`);
    writeFileSync(join(dir, `${ref.key}.txt`), segment);

    const track = { key: ref.key, label: ref.label, midiBytes: sound.midi.length, midiSha256: sha256(sound.midi), segmentSha256: sha256(segment) };
    if (ref.kind === "shared-song") {
      const preset = Number((await call(manager, SEL.get_shared_song_preset, [hex(species), "0x1"]))[0]);
      track.mode = decodeMode(await call(manager, SEL.get_shared_song_mode, [hex(species), "0x1"]));
      track.effects = EFFECT_NAMES[preset];
      track.effectsFrom = "King-controlled";
    } else {
      track.mode = decodeMode(await call(manager, SEL.get_track_sound_mode, [hex(id), ...ref.calldata]));
      track.effects = EFFECT_NAMES[effects];
      track.effectsFrom = "token";
    }
    if (ref.kind === "individual") {
      // Page<IndividualTrackRecord>: total, next_start option, items length, then id, purchase_block,
      // ready_at, binding (2 felts), edition_id, ...
      const page1 = await call(manager, SEL.get_individual_tracks, [hex(id), hex(ref.n), "0x1"]);
      const hasNext = Number(page1[1]) === 0;
      const rec = page1.slice(hasNext ? 4 : 3);
      const edition = Number(rec[5]);
      track.purchaseBlock = Number(rec[1]);
      track.edition = edition;
      track.label = edition === 0 ? `Purchased Song ${ref.n + 1}` : `Purchased Edition ${edition} (#${ref.n + 1})`;
    }
    tracks.push(track);
    console.log(`${beast.slug}/${ref.key}: midi ${sound.midi.length} B, ${track.mode}, ${track.effects}`);
  }

  const name = traits.Prefix ? `"${traits.Prefix} ${traits.Suffix}" ${traits.Beast}` : traits.Beast;
  manifest.beasts.push({
    slug: beast.slug,
    role: beast.role,
    name,
    tokenId: beast.id,
    speciesId: species,
    genesis: traits.Genesis === 1 || traits.Genesis === "1",
    visualEffects: traits["Visual Effects"],
    soundEffects: traits["Sound Effects"],
    cardGrade: traits["Card Grade"],
    rank: traits.Rank,
    trackCount: Number(traits["Track Count"]),
    pageSha256: sha256(page),
    cardSha256: sha256(svg),
    tracks,
  });
}
manifest.contracts.soundManager = speciesCache.get(1).manager;
manifest.contracts.renderer = speciesCache.get(1).renderer;
writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log(`Captured ${manifest.beasts.length} Beasts at block ${blockNumber} (${manifest.capture.date}).`);
