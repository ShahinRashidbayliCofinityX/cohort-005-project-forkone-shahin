import { Link } from "react-router";
import { BookOpen, User } from "lucide-react";
import { CourseImage } from "~/components/course-image";
import type { FeaturedCourse } from "~/modules/landing/index.server";

export function LandingCourseCard({ course }: { course: FeaturedCourse }) {
  return (
    <Link
      to={`/courses/${course.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:border-sunshine hover:shadow-xl"
    >
      <div className="relative">
        <CourseImage
          src={course.coverImageUrl}
          alt={course.title}
          className="aspect-video w-full object-cover"
        />
        <span className="absolute left-3 top-3 rounded-full bg-sunshine px-3 py-1 text-xs font-semibold text-navy">
          {course.categoryName}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-semibold leading-snug text-card-foreground">
          {course.title}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted-foreground">
          {course.description}
        </p>
        <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <User className="size-3" />
            {course.instructorName}
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="size-3" />
            {course.lessonCount}{" "}
            {course.lessonCount === 1 ? "lesson" : "lessons"}
          </span>
        </div>
      </div>
    </Link>
  );
}
