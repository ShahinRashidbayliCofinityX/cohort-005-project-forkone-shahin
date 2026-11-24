import { describe, it, expect, beforeEach } from "vitest";
import { createTestDb, seedBaseData, type TestDb } from "~/test/setup";
import * as schema from "~/db/schema";
import { CourseStatus } from "~/db/schema";
import { markdown } from "~/lib/text";
import { createLanding, FEATURED_COURSE_COUNT } from "../index.server";

let db: TestDb;
let instructorId: number;
let categoryId: number;

beforeEach(() => {
  db = createTestDb();
  const base = seedBaseData(db);
  instructorId = base.instructor.id;
  categoryId = base.category.id;
});

// ─── Fixtures ───
// Courses, modules and lessons are written by other parts of the app; this
// module only reads them, so rows go in directly, kept in one place.

let slugCounter = 0;

function addCourse(
  title: string,
  createdAt: string,
  status = CourseStatus.Published
) {
  slugCounter += 1;
  return db
    .insert(schema.courses)
    .values({
      title,
      slug: `landing-course-${slugCounter}`,
      description: `${title} description`,
      salesCopy: markdown(title),
      instructorId,
      categoryId,
      status,
      createdAt,
    })
    .returning()
    .get();
}

function addLessons(courseId: number, perModule: number[]) {
  perModule.forEach((lessonCount, position) => {
    const mod = db
      .insert(schema.modules)
      .values({ courseId, title: `Module ${position}`, position })
      .returning()
      .get();
    for (let i = 0; i < lessonCount; i++) {
      db.insert(schema.lessons)
        .values({ moduleId: mod.id, title: `Lesson ${i}`, position: i })
        .run();
    }
  });
}

function addCategory(name: string) {
  return db
    .insert(schema.categories)
    .values({ name, slug: name.toLowerCase() })
    .returning()
    .get();
}

function landingPage() {
  return createLanding(db).get();
}

describe("landing page", () => {
  it("features the newest published courses, newest first", () => {
    addCourse("Oldest", "2099-01-01T00:00:00.000Z");
    addCourse("Newest", "2099-03-01T00:00:00.000Z");
    addCourse("Middle", "2099-02-01T00:00:00.000Z");
    addCourse("Draft", "2099-04-01T00:00:00.000Z", CourseStatus.Draft);

    const titles = landingPage().featuredCourses.map((c) => c.title);

    expect(titles).toEqual(["Newest", "Middle", "Oldest"]);
  });

  it(`features at most ${FEATURED_COURSE_COUNT} courses`, () => {
    for (let month = 1; month <= 5; month++) {
      addCourse(`Course ${month}`, `2026-0${month}-01T00:00:00.000Z`);
    }

    expect(landingPage().featuredCourses).toHaveLength(FEATURED_COURSE_COUNT);
  });

  it("breaks a createdAt tie by the later course first", () => {
    const first = addCourse("First", "2099-05-01T00:00:00.000Z");
    const second = addCourse("Second", "2099-05-01T00:00:00.000Z");

    const ids = landingPage().featuredCourses.map((c) => c.id);

    expect(ids.slice(0, 2)).toEqual([second.id, first.id]);
  });

  it("shows each featured course's instructor, category and cover", () => {
    const course = addCourse("Shown", "2099-01-01T00:00:00.000Z");

    const [featured] = landingPage().featuredCourses;

    expect(featured).toEqual({
      id: course.id,
      title: "Shown",
      slug: course.slug,
      description: "Shown description",
      coverImageUrl: null,
      instructorName: "Test Instructor",
      categoryName: "Programming",
      lessonCount: 0,
    });
  });

  it("counts lessons across every module of each featured course", () => {
    const big = addCourse("Big", "2099-02-01T00:00:00.000Z");
    const small = addCourse("Small", "2099-01-01T00:00:00.000Z");
    addLessons(big.id, [2, 3]);
    addLessons(small.id, [1]);

    const counts = Object.fromEntries(
      landingPage().featuredCourses.map((c) => [c.title, c.lessonCount])
    );

    expect(counts).toEqual({ Big: 5, Small: 1, "Test Course": 0 });
  });

  it("counts every published course, past the featured few and past 50", () => {
    for (let i = 0; i < 60; i++) {
      addCourse(`Bulk ${i}`, "2026-01-01T00:00:00.000Z");
    }
    addCourse("Draft", "2026-01-01T00:00:00.000Z", CourseStatus.Draft);
    addCourse("Archived", "2026-01-01T00:00:00.000Z", CourseStatus.Archived);

    // 60 bulk courses plus the seeded base course.
    expect(landingPage().publishedCourseCount).toBe(61);
  });

  it("counts the categories", () => {
    addCategory("Design");
    addCategory("Data");

    expect(landingPage().categoryCount).toBe(3);
  });

  it("is empty when nothing is published", () => {
    const empty = createLanding(createTestDb()).get();

    expect(empty).toEqual({
      featuredCourses: [],
      publishedCourseCount: 0,
      categoryCount: 0,
    });
  });
});
