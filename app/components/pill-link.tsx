import { Link } from "react-router";

const sizes = {
  sm: "h-9 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

const variants = {
  primary: "bg-sunshine text-navy shadow-sm hover:bg-sunshine-dark",
  outline:
    "border border-white/30 text-white hover:border-sunshine hover:text-sunshine",
};

/** A rounded call-to-action link on the navy landing page. */
export function PillLink({
  to,
  children,
  size = "sm",
  variant = "primary",
}: {
  to: string;
  children: React.ReactNode;
  size?: keyof typeof sizes;
  variant?: keyof typeof variants;
}) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunshine focus-visible:ring-offset-2 focus-visible:ring-offset-navy ${sizes[size]} ${variants[variant]}`}
    >
      {children}
    </Link>
  );
}
