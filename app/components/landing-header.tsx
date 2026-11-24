import { Link } from "react-router";
import { useDarkMode } from "~/lib/use-dark-mode";
import { CadenceMark } from "~/components/cadence-mark";
import { PillLink } from "~/components/pill-link";
import { Moon, Sun } from "lucide-react";

const focusRing =
  "rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunshine";

export function LandingHeader({ signedIn }: { signedIn: boolean }) {
  const navLink = `whitespace-nowrap text-sm font-medium text-white/70 transition-colors hover:text-sunshine ${focusRing}`;

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-navy/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          to="/"
          className={`flex shrink-0 items-center gap-2 text-xl font-bold tracking-tight text-white ${focusRing}`}
        >
          <CadenceMark />
          Cadence
        </Link>
        <nav className="flex items-center gap-3 sm:gap-6">
          <Link to="/courses" className={`hidden sm:inline ${navLink}`}>
            Courses
          </Link>
          <ThemeToggle />
          {signedIn ? (
            <PillLink to="/dashboard">Dashboard</PillLink>
          ) : (
            <>
              <Link to="/login" className={navLink}>
                Log In
              </Link>
              <PillLink to="/signup">Sign Up</PillLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

function ThemeToggle() {
  const { isDark, toggleDarkMode } = useDarkMode();
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      onClick={toggleDarkMode}
      className={`p-2 text-white/70 transition-colors hover:text-sunshine ${focusRing}`}
      aria-label={label}
      title={label}
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
