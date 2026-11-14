export const dynamic = "force-dynamic";

import { AppShell } from "@/components/app-shell";
import { ConfigBanner } from "@/components/config-banner";
import { ThemeBadge } from "@/components/theme-badge";
import { getSessionProfile } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { THEMES } from "@/types";
import {
  createQuestion,
  toggleQuestionActive,
  updateUserRole,
} from "./actions";

export default async function AdminPage() {
  const { profile, configured } = await getSessionProfile();

  let questions: {
    id: string;
    theme: string;
    question: string;
    active: boolean;
    difficulty: number;
  }[] = [];
  let agents: {
    id: string;
    email: string;
    full_name: string | null;
    role: string;
  }[] = [];

  if (configured) {
    const supabase = createServerSupabaseClient();
    const [qRes, aRes] = await Promise.all([
      supabase
        .from("questions")
        .select("id, theme, question, active, difficulty")
        .order("created_at", { ascending: false })
        .limit(40),
      supabase
        .from("profiles")
        .select("id, email, full_name, role")
        .order("created_at", { ascending: false })
        .limit(40),
    ]);
    questions = qRes.data ?? [];
    agents = aRes.data ?? [];
  }

  return (
    <AppShell
      profile={profile}
      title="Administration"
      subtitle="Gestion des questions et des rôles agents."
    >
      {!configured && <ConfigBanner />}

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-panel-sheen p-6">
          <h2 className="font-display text-xl text-brand-mist">Nouvelle question</h2>
          <form action={createQuestion} className="mt-4 grid gap-3">
            <select
              name="theme"
              className="rounded border border-white/15 bg-brand-ink/60 px-3 py-2.5 text-sm"
              defaultValue="SSIAP"
            >
              {THEMES.map((theme) => (
                <option key={theme.slug} value={theme.slug}>
                  {theme.label}
                </option>
              ))}
            </select>
            <textarea
              name="question"
              required
              rows={2}
              placeholder="Énoncé"
              className="rounded border border-white/15 bg-brand-ink/60 px-3 py-2.5 text-sm"
            />
            {(["option_a", "option_b", "option_c", "option_d"] as const).map(
              (name, i) => (
                <input
                  key={name}
                  name={name}
                  required
                  placeholder={`Option ${String.fromCharCode(65 + i)}`}
                  className="rounded border border-white/15 bg-brand-ink/60 px-3 py-2.5 text-sm"
                />
              )
            )}
            <div className="grid grid-cols-2 gap-3">
              <select
                name="correct_answer"
                className="rounded border border-white/15 bg-brand-ink/60 px-3 py-2.5 text-sm"
                defaultValue="A"
              >
                {["A", "B", "C", "D"].map((letter) => (
                  <option key={letter} value={letter}>
                    Bonne réponse {letter}
                  </option>
                ))}
              </select>
              <select
                name="difficulty"
                className="rounded border border-white/15 bg-brand-ink/60 px-3 py-2.5 text-sm"
                defaultValue="1"
              >
                <option value="1">Facile</option>
                <option value="2">Moyen</option>
                <option value="3">Difficile</option>
              </select>
            </div>
            <input
              name="explanation"
              placeholder="Explication (optionnel)"
              className="rounded border border-white/15 bg-brand-ink/60 px-3 py-2.5 text-sm"
            />
            <button
              type="submit"
              className="justify-self-start rounded bg-brand-amber px-4 py-2 text-sm font-semibold text-brand-ink"
            >
              Ajouter
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-white/10 bg-panel-sheen p-6">
          <h2 className="font-display text-xl text-brand-mist">Rôles</h2>
          <ul className="mt-4 max-h-[420px] space-y-3 overflow-auto pr-1">
            {agents.map((agent) => (
              <li
                key={agent.id}
                className="rounded-xl border border-white/10 bg-brand-ink/40 p-3"
              >
                <p className="text-sm text-brand-mist">
                  {agent.full_name || agent.email}
                </p>
                <p className="text-xs text-brand-mist/45">{agent.email}</p>
                <form action={updateUserRole} className="mt-2 flex gap-2">
                  <input type="hidden" name="user_id" value={agent.id} />
                  <select
                    name="role"
                    defaultValue={agent.role}
                    className="flex-1 rounded border border-white/15 bg-brand-ink/60 px-2 py-1.5 text-xs"
                  >
                    <option value="agent">agent</option>
                    <option value="manager">manager</option>
                    <option value="admin">admin</option>
                  </select>
                  <button
                    type="submit"
                    className="rounded border border-brand-amber/40 px-2 py-1.5 text-xs text-brand-amber"
                  >
                    Sauver
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-8 rounded-2xl border border-white/10 bg-panel-sheen p-6">
        <h2 className="font-display text-xl text-brand-mist">Banque de questions</h2>
        <ul className="mt-4 divide-y divide-white/10">
          {questions.map((question) => (
            <li
              key={question.id}
              className="flex flex-wrap items-start justify-between gap-3 py-4"
            >
              <div className="max-w-3xl">
                <div className="mb-2 flex items-center gap-2">
                  <ThemeBadge theme={question.theme} />
                  <span className="text-xs text-brand-mist/45">
                    diff. {question.difficulty}
                  </span>
                </div>
                <p className="text-sm text-brand-mist/85">{question.question}</p>
              </div>
              <form
                action={toggleQuestionActive.bind(
                  null,
                  question.id,
                  !question.active
                )}
              >
                <button
                  type="submit"
                  className="rounded border border-white/15 px-3 py-1.5 text-xs text-brand-mist/70"
                >
                  {question.active ? "Désactiver" : "Activer"}
                </button>
              </form>
            </li>
          ))}
        </ul>
      </section>
    </AppShell>
  );
}
