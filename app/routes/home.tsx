import { Link } from "react-router";
import type { Route } from "./+types/home";
import {
  ArrowRight,
  BookOpen,
  Clock,
  GraduationCap,
  Layers,
} from "lucide-react";
import { DevUI } from "~/components/dev-ui";
import { LandingHeader, YellowLink } from "~/components/landing-header";
import { LandingCourseCard } from "~/components/landing-course-card";
import { getCurrentUserId, getDevCountry } from "~/lib/session";
import { getCountryTierInfo, COUNTRIES } from "~/lib/ppp";
import { landing } from "~/modules/landing/index.server";
import { eq } from "drizzle-orm";
import { db } from "~/db";
import { users } from "~/db/schema";

export function meta() {
  return [
    { title: "Cadence — Learn at your own pace" },
    {
      name: "description",
      content:
        "A modern course platform for developers. Browse courses, track your progress, and learn at your own pace.",
    },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const currentUserId = await getCurrentUserId(request);
  const currentUser = currentUserId
    ? db.select().from(users).where(eq(users.id, currentUserId)).get()
    : null;
  const devCountry = await getDevCountry(request);

  return {
    ...landing.get(),
    users: db
      .select({ id: users.id, name: users.name, role: users.role })
      .from(users)
      .all(),
    currentUser: currentUser
      ? { id: currentUser.id, name: currentUser.name, role: currentUser.role }
      : null,
    devCountry,
    countryTierInfo: getCountryTierInfo(devCountry),
    countries: COUNTRIES,
  };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const {
    featuredCourses,
    publishedCourseCount,
    categoryCount,
    users,
    currentUser,
    devCountry,
    countryTierInfo,
    countries,
  } = loaderData;

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader signedIn={currentUser !== null} />

      <section className="relative overflow-hidden bg-navy text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 size-96 rounded-full bg-sunshine/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -left-24 size-96 rounded-full bg-navy-light blur-3xl"
        />
        <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-20 text-center sm:px-6 sm:pt-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-sunshine/40 bg-sunshine/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-sunshine">
            <Clock className="size-3" />
            Self-paced learning
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
            Learn to code,{" "}
            <span className="text-sunshine">at your own pace</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-white/70 sm:text-lg">
            Structured courses built by experienced instructors. Track your
            progress, take quizzes, and build real-world skills.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <YellowLink to="/courses" size="lg">
              Browse Courses
              <ArrowRight className="size-4" />
            </YellowLink>
            {!currentUser && (
              <Link
                to="/signup"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/30 px-6 font-semibold text-white transition-colors hover:border-sunshine hover:text-sunshine"
              >
                Create a free account
              </Link>
            )}
          </div>

          <dl className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
            <Stat
              icon={BookOpen}
              value={publishedCourseCount}
              label="Courses"
            />
            <Stat icon={Layers} value={categoryCount} label="Categories" />
            <Stat
              icon={GraduationCap}
              value="Self-paced"
              label="Your schedule"
            />
          </dl>
        </div>
      </section>

      {featuredCourses.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-navy dark:text-sunshine">
                Just released
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight">
                Newest courses
              </h2>
              <p className="mt-2 text-muted-foreground">
                Fresh from our instructors
              </p>
            </div>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 font-semibold text-navy underline-offset-4 hover:underline dark:text-sunshine"
            >
              View all courses
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCourses.map((course) => (
              <LandingCourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>
      )}

      <footer className="bg-navy py-10 text-white/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm sm:flex-row sm:px-6">
          <span className="flex items-center gap-2 font-semibold text-white">
            <span
              aria-hidden
              className="flex size-6 items-center justify-center rounded bg-sunshine text-xs font-black text-navy"
            >
              C
            </span>
            Cadence
          </span>
          <Link to="/courses" className="hover:text-sunshine">
            Browse courses
          </Link>
        </div>
      </footer>

      <DevUI
        users={users}
        currentUser={currentUser}
        devCountry={devCountry}
        countryTierInfo={countryTierInfo}
        countries={countries}
      />
    </div>
  );
}

function Stat({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof BookOpen;
  value: number | string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5 backdrop-blur">
      <dt className="flex items-center justify-center gap-2 text-sm text-white/60">
        <Icon className="size-4 text-sunshine" />
        {label}
      </dt>
      <dd className="mt-1 text-3xl font-bold text-white">{value}</dd>
    </div>
  );
}
