import { excerpt, type NotePreview } from "./lib/excerpt";

export type { NotePreview };

/**
 * The Saved page lists every Note at once, so it shows a short excerpt of
 * each; the whole Note stays one click away on its Lesson page.
 */
export const NOTE_PREVIEW_LIMITS = { maxChars: 280, maxLines: 6 } as const;

/** `truncated` lets the page offer the full Note only when some was cut. */
export function notePreview(body: string): NotePreview {
  return excerpt(body, NOTE_PREVIEW_LIMITS);
}
