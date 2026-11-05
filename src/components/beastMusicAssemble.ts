/**
 * Rebuilds a token's onchain player page from shared parts. Used by the browser and by
 * scripts/capture-beast-samples.mjs, which proves the result is byte-identical to the chain's
 * `animation_url` before it writes anything.
 */

export const GAP = "@@GAP@@";
export const CARD = "@@CARD@@";
export const SEGMENT = "@@SEGMENT@@";

const SETTINGS_OPEN = '<script type="text/plain" id="onchain-midi-settings">';
const DATA_OPEN = '<script type="text/plain" id="onchain-midi-data">';
const CLOSE = "</script>";

/** A card is a list of literal strings and indexes into the shared part list. */
export function assembleCard(parts: Array<string | number>, shared: string[]) {
  return parts.map((part) => (typeof part === "number" ? shared[part] : part)).join("");
}

/** The two music blocks, as the renderer's `tinysynth_midi_segment` writes them. */
export function assembleSegment(settings: string, midiBase64: string, padding: number) {
  return `${SETTINGS_OPEN}${settings}${CLOSE}${DATA_OPEN}${midiBase64}${CLOSE}${" ".repeat(padding)}`;
}

/** Fills a shared shell with one token's whitespace runs, card and music. */
export function assemblePage(shell: string, gaps: number[], card: string, segment: string) {
  let gap = 0;
  return shell
    .split(GAP)
    .map((piece, index) => (index === 0 ? piece : " ".repeat(gaps[gap++]) + piece))
    .join("")
    .replace(CARD, () => btoa(card))
    .replace(SEGMENT, () => segment);
}
