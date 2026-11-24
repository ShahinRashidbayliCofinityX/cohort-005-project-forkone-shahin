import { excerpt, type NotePreview } from "./lib/excerpt";

export type { NotePreview };

/**
 * The Saved page lists every Note at once, so it shows a short excerpt of
 * each; the whole Note stays one click away on its Lesson page.
 */
export const NOTE_PREVIEW_LIMITS = { maxChars: 280, maxLines: 6 } as const;

/**
 * A Note body as the Saved page shows it: blank-line runs collapsed, then cut
 * to {@link NOTE_PREVIEW_LIMITS} with an ellipsis. `truncated` says whether
 * anything was dropped, so the page can offer the full Note.
 */
export function notePreview(body: string): NotePreview {
  return excerpt(body, NOTE_PREVIEW_LIMITS);
}
