export const dynamic = "force-dynamic";

import { AppShell } from "@/components/app-shell";
import { ConfigBanner } from "@/components/config-banner";
import { getSessionProfile } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Question } from "@/types";
import { PlayClient } from "./play-client";

type PlayQuestion = Pick<
  Question,
  | "id"
  | "theme"
  | "question"
  | "option_a"
  | "option_b"
  | "option_c"
  | "option_d"
  | "correct_answer"
  | "explanation"
>;

export default async function PlayPage() {
  const { profile, configured } = await getSessionProfile();
  let questions: PlayQuestion[] = [];

  if (configured) {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from("questions")
      .select(
        "id, theme, question, option_a, option_b, option_c, option_d, correct_answer, explanation"
      )
      .eq("active", true);
    questions = (data as PlayQuestion[] | null) ?? [];
  }

  return (
    <AppShell
      profile={profile}
      title="Mode jeu"
      subtitle="Choisis un thème et enchaîne une mission de 10 questions."
    >
      {!configured && <ConfigBanner />}
      <PlayClient questions={questions} />
    </AppShell>
  );
}
