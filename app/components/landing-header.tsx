import { Link } from "react-router";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function LandingHeader({ signedIn }: { signedIn: boolean }) {
  const navLink =
    "whitespace-nowrap text-sm font-medium text-white/70 transition-colors hover:text-sunshine";

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-navy/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2 text-xl font-bold tracking-tight text-white"
        >
          <span
            aria-hidden
            className="flex size-7 items-center justify-center rounded-md bg-sunshine text-sm font-black text-navy"
          >
            C
          </span>
          Cadence
        </Link>
        <nav className="flex items-center gap-3 sm:gap-6">
          <Link to="/courses" className={`hidden sm:inline ${navLink}`}>
            Courses
          </Link>
          <ThemeToggle />
          {signedIn ? (
            <YellowLink to="/dashboard">Dashboard</YellowLink>
          ) : (
            <>
              <Link to="/login" className={navLink}>
                Log In
              </Link>
              <YellowLink to="/signup">Sign Up</YellowLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export function YellowLink({
  to,
  children,
  size = "sm",
}: {
  to: string;
  children: React.ReactNode;
  size?: "sm" | "lg";
}) {
  const sizing = size === "lg" ? "h-12 px-6 text-base" : "h-9 px-4 text-sm";
  return (
    <Link
      to={to}
      className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-sunshine font-semibold text-navy shadow-sm transition-colors hover:bg-sunshine-dark ${sizing}`}
    >
      {children}
    </Link>
  );
}

function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggleDarkMode() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("cadence-theme", next ? "dark" : "light");
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={toggleDarkMode}
      className="rounded-md p-2 text-white/70 transition-colors hover:text-sunshine"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
