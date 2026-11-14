export const dynamic = "force-dynamic";

import { AppShell } from "@/components/app-shell";
import { ConfigBanner } from "@/components/config-banner";
import { ThemeBadge } from "@/components/theme-badge";
import { getSessionProfile } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const { profile, configured } = await getSessionProfile();

  let agentsCount = 0;
  let gamesCount = 0;
  let recentGames: {
    id: string;
    theme: string;
    score: number;
    total_questions: number;
    completed_at: string | null;
    agent_name: string;
  }[] = [];

  if (configured) {
    const supabase = createServerSupabaseClient();
    const [agentsRes, gamesRes, recentRes] = await Promise.all([
      supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("role", "agent"),
      supabase.from("games").select("id", { count: "exact", head: true }),
      supabase
        .from("games")
        .select(
          "id, theme, score, total_questions, completed_at, user_id, profiles(full_name, email)"
        )
        .order("created_at", { ascending: false })
        .limit(12),
    ]);
    agentsCount = agentsRes.count ?? 0;
    gamesCount = gamesRes.count ?? 0;
    recentGames = (recentRes.data ?? []).map((game) => {
      const linked = game.profiles as
        | { full_name: string | null; email: string }
        | { full_name: string | null; email: string }[]
        | null;
      const profile = Array.isArray(linked) ? linked[0] : linked;
      return {
        id: game.id as string,
        theme: game.theme as string,
        score: game.score as number,
        total_questions: game.total_questions as number,
        completed_at: (game.completed_at as string | null) ?? null,
        agent_name: profile?.full_name || profile?.email || "Agent",
      };
    });
  }

  return (
    <AppShell
      profile={profile}
      title="Dashboard manager"
      subtitle="Vue d’ensemble des agents et des parties récentes."
    >
      {!configured && <ConfigBanner />}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-panel-sheen p-6">
          <p className="text-sm text-brand-mist/55">Agents</p>
          <p className="mt-2 font-display text-4xl text-brand-amber">{agentsCount}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-panel-sheen p-6">
          <p className="text-sm text-brand-mist/55">Parties jouées</p>
          <p className="mt-2 font-display text-4xl text-brand-amber">{gamesCount}</p>
        </div>
      </div>

      <section className="mt-8 rounded-2xl border border-white/10 bg-panel-sheen p-6">
        <h2 className="font-display text-xl text-brand-mist">Activité récente</h2>
        {recentGames.length === 0 ? (
          <p className="mt-4 text-sm text-brand-mist/55">Pas encore d’activité.</p>
        ) : (
          <ul className="mt-4 divide-y divide-white/10">
            {recentGames.map((game) => (
              <li
                key={game.id}
                className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm"
              >
                <div>
                  <p className="text-brand-mist">{game.agent_name}</p>
                  <p className="text-xs text-brand-mist/50">
                    {game.completed_at
                      ? new Date(game.completed_at).toLocaleString("fr-FR", {
                          timeZone: "Europe/Paris",
                        })
                      : "—"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <ThemeBadge theme={game.theme} />
                  <span className="text-brand-amber">
                    {game.score}/{game.total_questions}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </AppShell>
  );
}
