import { SiteHeader } from "./site-header";
import type { Profile } from "@/types";

export function AppShell({
  profile,
  children,
  title,
  subtitle,
}: {
  profile: Profile | null;
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="min-h-screen">
      <SiteHeader role={profile?.role} email={profile?.email} />
      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <div className="mb-8 animate-fade-up">
          <h1 className="font-display text-3xl text-brand-mist md:text-4xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 max-w-2xl text-brand-mist/65">{subtitle}</p>
          )}
        </div>
        {children}
      </main>
    </div>
  );
}
