import { count, desc, eq, inArray } from "drizzle-orm";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import * as schema from "~/db/schema";
import { CourseStatus } from "~/db/schema";

export type Db = BetterSQLite3Database<typeof schema>;

export const FEATURED_COURSE_COUNT = 3;

export type FeaturedCourse = {
  id: number;
  title: string;
  slug: string;
  description: string;
  coverImageUrl: string | null;
  instructorName: string;
  categoryName: string;
  lessonCount: number;
};

export type LandingPage = {
  featuredCourses: FeaturedCourse[];
  publishedCourseCount: number;
  categoryCount: number;
};

export function getLandingPage(db: Db): LandingPage {
  return {
    featuredCourses: getNewestPublishedCourses(db),
    publishedCourseCount: countPublishedCourses(db),
    categoryCount: countCategories(db),
  };
}

const isPublished = eq(schema.courses.status, CourseStatus.Published);

function getNewestPublishedCourses(db: Db): FeaturedCourse[] {
  const rows = db
    .select({
      id: schema.courses.id,
      title: schema.courses.title,
      slug: schema.courses.slug,
      description: schema.courses.description,
      coverImageUrl: schema.courses.coverImageUrl,
      instructorName: schema.users.name,
      categoryName: schema.categories.name,
    })
    .from(schema.courses)
    .innerJoin(schema.users, eq(schema.courses.instructorId, schema.users.id))
    .innerJoin(
      schema.categories,
      eq(schema.courses.categoryId, schema.categories.id)
    )
    .where(isPublished)
    // id breaks ties so courses created in the same instant keep a stable order.
    .orderBy(desc(schema.courses.createdAt), desc(schema.courses.id))
    .limit(FEATURED_COURSE_COUNT)
    .all();

  const lessonCounts = countLessonsByCourse(
    db,
    rows.map((row) => row.id)
  );
  return rows.map((row) => ({
    ...row,
    lessonCount: lessonCounts.get(row.id) ?? 0,
  }));
}

function countLessonsByCourse(db: Db, courseIds: number[]) {
  const rows = db
    .select({ courseId: schema.modules.courseId, lessonCount: count() })
    .from(schema.lessons)
    .innerJoin(schema.modules, eq(schema.lessons.moduleId, schema.modules.id))
    .where(inArray(schema.modules.courseId, courseIds))
    .groupBy(schema.modules.courseId)
    .all();
  return new Map(rows.map((row) => [row.courseId, row.lessonCount]));
}

function countPublishedCourses(db: Db) {
  const [{ value }] = db
    .select({ value: count() })
    .from(schema.courses)
    .where(isPublished)
    .all();
  return value;
}

function countCategories(db: Db) {
  const [{ value }] = db
    .select({ value: count() })
    .from(schema.categories)
    .all();
  return value;
}
