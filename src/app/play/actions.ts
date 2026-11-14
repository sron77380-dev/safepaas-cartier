"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ThemeSlug } from "@/types";
import { revalidatePath } from "next/cache";

export async function saveGameResult(input: {
  theme: ThemeSlug | "MIXTE";
  score: number;
  total: number;
  duration_seconds: number;
  answers: {
    question_id: string;
    selected_answer: "A" | "B" | "C" | "D";
    is_correct: boolean;
  }[];
}) {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Non authentifié");
  }

  const { data: game, error: gameError } = await supabase
    .from("games")
    .insert({
      user_id: user.id,
      theme: input.theme,
      score: input.score,
      total_questions: input.total,
      duration_seconds: input.duration_seconds,
      completed_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (gameError || !game) {
    throw new Error(gameError?.message ?? "Impossible d'enregistrer la partie");
  }

  if (input.answers.length > 0) {
    const { error: answersError } = await supabase.from("game_answers").insert(
      input.answers.map((answer) => ({
        game_id: game.id,
        question_id: answer.question_id,
        selected_answer: answer.selected_answer,
        is_correct: answer.is_correct,
      }))
    );

    if (answersError) {
      throw new Error(answersError.message);
    }
  }

  if (input.theme !== "MIXTE") {
    const { data: existing } = await supabase
      .from("themes_stats")
      .select("*")
      .eq("user_id", user.id)
      .eq("theme", input.theme)
      .maybeSingle();

    const correct = input.answers.filter((a) => a.is_correct).length;
    const total = input.answers.length;
    const pct = input.total > 0 ? Math.round((input.score / input.total) * 100) : 0;

    if (existing) {
      await supabase
        .from("themes_stats")
        .update({
          games_played: existing.games_played + 1,
          correct_answers: existing.correct_answers + correct,
          total_answers: existing.total_answers + total,
          best_score: Math.max(existing.best_score, pct),
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);
    } else {
      await supabase.from("themes_stats").insert({
        user_id: user.id,
        theme: input.theme,
        games_played: 1,
        correct_answers: correct,
        total_answers: total,
        best_score: pct,
      });
    }
  }

  if (input.score === input.total && input.total >= 5) {
    await supabase.from("badges").upsert(
      {
        user_id: user.id,
        badge_key: `perfect_${input.theme.toLowerCase()}`,
        label: `Sans faute — ${input.theme}`,
      },
      { onConflict: "user_id,badge_key" }
    );
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard");
}
