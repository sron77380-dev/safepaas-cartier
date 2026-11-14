"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { BrandMark } from "@/components/brand-mark";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createBrowserSupabaseClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    router.push("/play");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-fade-up rounded-2xl border border-white/10 bg-panel-sheen p-8 shadow-2xl shadow-black/30">
        <BrandMark size="md" />
        <h1 className="mt-4 font-display text-2xl text-brand-mist">Inscription</h1>
        <p className="mt-2 text-sm text-brand-mist/60">
          Crée ton profil agent — rôle par défaut : agent.
        </p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <label className="block text-sm">
            <span className="mb-1.5 block text-brand-mist/70">Nom complet</span>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded border border-white/15 bg-brand-ink/60 px-3 py-2.5 outline-none ring-brand-amber/40 focus:ring-2"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block text-brand-mist/70">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-white/15 bg-brand-ink/60 px-3 py-2.5 outline-none ring-brand-amber/40 focus:ring-2"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block text-brand-mist/70">Mot de passe</span>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border border-white/15 bg-brand-ink/60 px-3 py-2.5 outline-none ring-brand-amber/40 focus:ring-2"
            />
          </label>
          {error && (
            <p className="rounded border border-brand-danger/40 bg-brand-danger/10 px-3 py-2 text-sm text-red-200">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-brand-amber py-2.5 text-sm font-semibold text-brand-ink transition hover:bg-[#f0b84a] disabled:opacity-60"
          >
            {loading ? "Création…" : "Créer mon compte"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-brand-mist/60">
          Déjà inscrit ?{" "}
          <Link href="/login" className="text-brand-amber hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </main>
  );
}
