export const dynamic = "force-dynamic";

import { AppShell } from "@/components/app-shell";
import { ConfigBanner } from "@/components/config-banner";
import { ThemeBadge } from "@/components/theme-badge";
import { getSessionProfile } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { formatScore } from "@/lib/utils";

export default async function ProfilePage() {
  const { userId, profile, configured } = await getSessionProfile();

  let games: {
    id: string;
    theme: string;
    score: number;
    total_questions: number;
    completed_at: string | null;
  }[] = [];
  let stats: {
    theme: string;
    games_played: number;
    best_score: number;
    correct_answers: number;
    total_answers: number;
  }[] = [];
  let badges: { id: string; label: string; earned_at: string }[] = [];

  if (configured && userId) {
    const supabase = createServerSupabaseClient();
    const [gamesRes, statsRes, badgesRes] = await Promise.all([
      supabase
        .from("games")
        .select("id, theme, score, total_questions, completed_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(8),
      supabase
        .from("themes_stats")
        .select("theme, games_played, best_score, correct_answers, total_answers")
        .eq("user_id", userId),
      supabase
        .from("badges")
        .select("id, label, earned_at")
        .eq("user_id", userId)
        .order("earned_at", { ascending: false }),
    ]);
    games = gamesRes.data ?? [];
    stats = statsRes.data ?? [];
    badges = badgesRes.data ?? [];
  }

  return (
    <AppShell
      profile={profile}
      title="Profil agent"
      subtitle={profile?.full_name ?? profile?.email ?? "Ton parcours SafePass"}
    >
      {!configured && <ConfigBanner />}

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-white/10 bg-panel-sheen p-6 lg:col-span-1">
          <h2 className="font-display text-xl text-brand-mist">Identité</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-brand-mist/50">Rôle</dt>
              <dd className="capitalize text-brand-amber">{profile?.role ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-brand-mist/50">Email</dt>
              <dd>{profile?.email ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-brand-mist/50">Site</dt>
              <dd>{profile?.site ?? "Fondation Cartier"}</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-2xl border border-white/10 bg-panel-sheen p-6 lg:col-span-2">
          <h2 className="font-display text-xl text-brand-mist">Stats par thème</h2>
          {stats.length === 0 ? (
            <p className="mt-4 text-sm text-brand-mist/55">
              Joue une première mission pour débloquer tes stats.
            </p>
          ) : (
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {stats.map((stat) => (
                <li
                  key={stat.theme}
                  className="rounded-xl border border-white/10 bg-brand-ink/40 p-4"
                >
                  <ThemeBadge theme={stat.theme} />
                  <p className="mt-3 text-sm text-brand-mist/70">
                    {stat.games_played} partie(s) · meilleur score {stat.best_score}%
                  </p>
                  <p className="mt-1 text-xs text-brand-mist/50">
                    Réussite {formatScore(stat.correct_answers, stat.total_answers)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-white/10 bg-panel-sheen p-6 lg:col-span-2">
          <h2 className="font-display text-xl text-brand-mist">Dernières parties</h2>
          {games.length === 0 ? (
            <p className="mt-4 text-sm text-brand-mist/55">Aucune partie pour l’instant.</p>
          ) : (
            <ul className="mt-4 divide-y divide-white/10">
              {games.map((game) => (
                <li
                  key={game.id}
                  className="flex items-center justify-between gap-3 py-3 text-sm"
                >
                  <div className="flex items-center gap-3">
                    <ThemeBadge theme={game.theme} />
                    <span className="text-brand-mist/55">
                      {game.completed_at
                        ? new Date(game.completed_at).toLocaleString("fr-FR", {
                            timeZone: "Europe/Paris",
                          })
                        : "—"}
                    </span>
                  </div>
                  <span className="font-medium text-brand-amber">
                    {game.score}/{game.total_questions}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-white/10 bg-panel-sheen p-6">
          <h2 className="font-display text-xl text-brand-mist">Badges</h2>
          {badges.length === 0 ? (
            <p className="mt-4 text-sm text-brand-mist/55">
              Réussis une mission sans faute pour gagner un badge.
            </p>
          ) : (
            <ul className="mt-4 space-y-2">
              {badges.map((badge) => (
                <li
                  key={badge.id}
                  className="rounded-lg border border-brand-amber/20 bg-brand-amber/10 px-3 py-2 text-sm text-brand-sand"
                >
                  {badge.label}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </AppShell>
  );
}
