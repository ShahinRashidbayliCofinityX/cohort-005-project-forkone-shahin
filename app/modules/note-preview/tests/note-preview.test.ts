import { describe, it, expect } from "vitest";
import { NOTE_PREVIEW_LIMITS, notePreview } from "../index";

const { maxChars, maxLines } = NOTE_PREVIEW_LIMITS;

describe("notePreview", () => {
  it("returns a short note unchanged", () => {
    expect(notePreview("Types are erased at runtime.")).toEqual({
      text: "Types are erased at runtime.",
      truncated: false,
    });
  });

  it("trims surrounding whitespace without calling it truncated", () => {
    expect(notePreview("\n\n  hello  \n\n")).toEqual({
      text: "hello",
      truncated: false,
    });
  });

  it("collapses runs of blank lines into one paragraph break", () => {
    expect(notePreview("first\n\n\n\n\nsecond").text).toBe("first\n\nsecond");
    expect(notePreview("first\n  \n \t\n\nsecond").text).toBe(
      "first\n\nsecond"
    );
  });

  it("keeps a single paragraph break as written", () => {
    expect(notePreview("first\n\nsecond")).toEqual({
      text: "first\n\nsecond",
      truncated: false,
    });
  });

  it("normalises Windows line endings", () => {
    expect(notePreview("a\r\nb\rc").text).toBe("a\nb\nc");
  });

  it("keeps a note of exactly the line limit whole", () => {
    const body = Array.from({ length: maxLines }, (_, i) => `line ${i}`).join(
      "\n"
    );
    expect(notePreview(body)).toEqual({ text: body, truncated: false });
  });

  it("cuts a note over the line limit and adds an ellipsis", () => {
    const lines = Array.from({ length: maxLines + 3 }, (_, i) => `line ${i}`);
    expect(notePreview(lines.join("\n"))).toEqual({
      text: `${lines.slice(0, maxLines).join("\n")}…`,
      truncated: true,
    });
  });

  it("keeps a note of exactly the character limit whole", () => {
    const body = "a".repeat(maxChars);
    expect(notePreview(body)).toEqual({ text: body, truncated: false });
  });

  it("cuts a long note at the last whole word before the limit", () => {
    const body = "word ".repeat(100).trim();
    const kept = "word ".repeat(Math.floor((maxChars + 1) / 5)).trim();
    expect(notePreview(body)).toEqual({ text: `${kept}…`, truncated: true });
  });

  it("keeps the last word when it ends exactly at the limit", () => {
    const body = `${"a".repeat(maxChars - 5)} tail more words`;
    expect(notePreview(body).text).toBe(`${"a".repeat(maxChars - 5)} tail…`);
  });

  it("keeps a multi-word note of exactly the limit whole", () => {
    const body = `${"a".repeat(maxChars - 5)} tail`;
    expect(notePreview(body)).toEqual({ text: body, truncated: false });
  });

  it("drops the whole run of spaces before the ellipsis", () => {
    const body = `${"x".repeat(maxChars - 2)}   tail`;
    expect(notePreview(body).text).toBe(`${"x".repeat(maxChars - 2)}…`);
  });

  it("hard-cuts a single word longer than the limit", () => {
    const body = "y".repeat(maxChars + 50);
    expect(notePreview(body)).toEqual({
      text: `${"y".repeat(maxChars)}…`,
      truncated: true,
    });
  });

  it("does not end the excerpt on a blank line", () => {
    const lines = Array.from({ length: maxLines - 1 }, (_, i) => `l${i}`);
    const body = [...lines, "", "after the break"].join("\n");
    expect(notePreview(body)).toEqual({
      text: `${lines.join("\n")}…`,
      truncated: true,
    });
  });

  it("cuts by characters within the lines it kept", () => {
    const longLine = "z ".repeat(maxChars).trim();
    const body = [longLine, ...Array(maxLines + 2).fill("more")].join("\n");
    const kept = "z ".repeat(Math.floor((maxChars + 1) / 2)).trim();
    expect(notePreview(body)).toEqual({ text: `${kept}…`, truncated: true });
  });
});
