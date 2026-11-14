import Link from "next/link";
import { BrandMark } from "./brand-mark";

const links = [
  { href: "/play", label: "Jouer" },
  { href: "/profile", label: "Profil" },
  { href: "/notifications", label: "Alertes" },
];

export function SiteHeader({
  role,
  email,
}: {
  role?: string | null;
  email?: string | null;
}) {
  return (
    <header className="relative z-20 border-b border-white/10 bg-brand-ink/40 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-6">
        <Link href="/" className="transition hover:opacity-90">
          <BrandMark size="sm" />
        </Link>
        <nav className="flex items-center gap-3 overflow-x-auto text-sm text-brand-mist/80 md:gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap transition hover:text-brand-amber"
            >
              {link.label}
            </Link>
          ))}
          {(role === "manager" || role === "admin") && (
            <Link
              href="/dashboard"
              className="whitespace-nowrap transition hover:text-brand-amber"
            >
              Dashboard
            </Link>
          )}
          {role === "admin" && (
            <Link
              href="/admin"
              className="whitespace-nowrap transition hover:text-brand-amber"
            >
              Admin
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-3 text-xs text-brand-mist/60">
          {email ? (
            <>
              <span className="hidden max-w-[160px] truncate sm:inline">{email}</span>
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="rounded border border-white/15 px-3 py-1.5 text-brand-mist/80 transition hover:border-brand-amber/50 hover:text-brand-amber"
                >
                  Sortir
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded bg-brand-amber px-3 py-1.5 font-medium text-brand-ink transition hover:bg-brand-amber/90"
            >
              Connexion
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
