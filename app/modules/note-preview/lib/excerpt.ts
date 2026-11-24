export type NotePreview = { text: string; truncated: boolean };

export type ExcerptLimits = { maxChars: number; maxLines: number };

const ELLIPSIS = "…";

/** Runs of three or more line breaks read as one paragraph break. */
function collapseBlankLines(body: string): string {
  return body
    .replace(/\r\n?/g, "\n")
    .replace(/\n[ \t]*(?:\n[ \t]*){2,}/g, "\n\n");
}

/**
 * Looks one character past the limit to see whether the last word fits,
 * then drops it if it does not. A single word longer than the limit has no
 * space to cut at, so it is cut where it stands.
 */
function cutAtWord(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text;
  return text
    .slice(0, maxChars + 1)
    .replace(/\s+\S*$/, "")
    .slice(0, maxChars);
}

export function excerpt(body: string, limits: ExcerptLimits): NotePreview {
  const text = collapseBlankLines(body).trim();
  const keptLines = text.split("\n").slice(0, limits.maxLines).join("\n");
  const cut = cutAtWord(keptLines.trimEnd(), limits.maxChars);
  return cut === text
    ? { text, truncated: false }
    : { text: cut + ELLIPSIS, truncated: true };
}
