import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-hero-grid" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e8a838' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-6 md:px-6">
          <BrandMark size="sm" />
          <Link
            href="/login"
            className="text-sm text-brand-mist/70 transition hover:text-brand-amber"
          >
            Connexion
          </Link>
        </header>

        <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 pb-20 pt-8 md:px-6">
          <p className="animate-fade-up mb-4 text-sm uppercase tracking-[0.25em] text-brand-sand/80">
            Fondation Cartier · SocialSticks
          </p>
          <BrandMark size="lg" className="animate-fade-up" />
          <h1 className="animate-fade-up-delay mt-6 max-w-2xl font-display text-3xl font-medium leading-tight text-brand-mist md:text-5xl">
            La formation sécurité qui se joue comme une mission.
          </h1>
          <p className="animate-fade-up-delay-2 mt-5 max-w-xl text-base leading-relaxed text-brand-mist/70 md:text-lg">
            Quiz SSIAP, TFP, APS, SST et consignes Fondation Cartier — pour ancrer
            les bons réflexes terrain.
          </p>
          <div className="animate-fade-up-delay-2 mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/register"
              className="animate-pulse-ring rounded bg-brand-amber px-6 py-3 text-sm font-semibold text-brand-ink transition hover:bg-[#f0b84a]"
            >
              Créer un compte agent
            </Link>
            <Link
              href="/login"
              className="rounded border border-white/20 px-6 py-3 text-sm font-medium text-brand-mist transition hover:border-brand-amber/50 hover:text-brand-amber"
            >
              Se connecter
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
