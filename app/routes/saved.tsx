import { Link } from "react-router";
import type { Route } from "./+types/saved";
import { db } from "~/db";
import { people } from "~/modules/permissions/person.server";
import { listBookmarks } from "~/lib/bookmarks.server";
import { listNotes } from "~/lib/notes.server";
import { notePreview } from "~/modules/note-preview";
import { Card, CardContent } from "~/components/ui/card";
import { Bookmark, NotebookPen } from "lucide-react";
import { formatRelativeTime } from "~/lib/utils";

export function meta() {
  return [
    { title: "Saved — Cadence" },
    { name: "description", content: "Your bookmarks and notes" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const { id: userId } = await people.requirePerson(request);

  return {
    savedBookmarks: listBookmarks(db, userId),
    savedNotes: listNotes(db, userId),
  };
}

export default function Saved({ loaderData }: Route.ComponentProps) {
  const { savedBookmarks, savedNotes } = loaderData;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Saved</h1>
        <p className="text-sm text-muted-foreground">
          The lessons you flagged, and what you wrote about them.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 flex items-center gap-2 font-semibold">
            <Bookmark className="size-4 text-muted-foreground" />
            Bookmarks
          </h2>

          {savedBookmarks.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                No bookmarks yet.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {savedBookmarks.map((bookmark) => (
                <SavedLessonCard key={bookmark.id} lesson={bookmark.lesson} />
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-3 flex items-center gap-2 font-semibold">
            <NotebookPen className="size-4 text-muted-foreground" />
            Notes
          </h2>

          {savedNotes.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                No notes yet.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {savedNotes.map((note) => {
                const preview = notePreview(note.body);
                return (
                  <SavedLessonCard key={note.id} lesson={note.lesson}>
                    {/* Plain text — a Note is never rendered as Markdown. */}
                    <p className="mt-2 whitespace-pre-wrap border-l-2 border-border pl-3 text-sm leading-relaxed text-foreground/90 [overflow-wrap:anywhere]">
                      {preview.text}
                    </p>
                    <div className="flex items-center gap-3 pt-1 text-xs text-muted-foreground">
                      <span suppressHydrationWarning>
                        Edited {formatRelativeTime(note.updatedAt)}
                      </span>
                      {preview.truncated && (
                        <Link
                          to={lessonPath(note.lesson)}
                          className="font-medium text-foreground hover:underline"
                        >
                          Read full note
                        </Link>
                      )}
                    </div>
                  </SavedLessonCard>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

type SavedLesson =
  Route.ComponentProps["loaderData"]["savedBookmarks"][number]["lesson"];

function lessonPath(lesson: SavedLesson) {
  return `/courses/${lesson.courseSlug}/lessons/${lesson.id}`;
}

/** A row on the Saved page: a link to the Lesson, named with its Course. */
function SavedLessonCard({
  lesson,
  children,
}: {
  lesson: SavedLesson;
  children?: React.ReactNode;
}) {
  return (
    <Card className="gap-0 py-4">
      <CardContent className="min-w-0 space-y-1">
        <Link
          to={lessonPath(lesson)}
          className="text-sm font-medium hover:underline"
        >
          {lesson.title}
        </Link>
        <p className="text-xs text-muted-foreground">{lesson.courseTitle}</p>
        {children}
      </CardContent>
    </Card>
  );
}
