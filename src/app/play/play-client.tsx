"use client";

import { useState } from "react";
import { QuizGame } from "@/components/quiz-game";
import { ThemeBadge } from "@/components/theme-badge";
import { THEMES, type Question, type ThemeSlug } from "@/types";
import { saveGameResult } from "./actions";

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

function pickQuestions(all: PlayQuestion[], theme: ThemeSlug | "MIXTE", count = 10) {
  const pool =
    theme === "MIXTE" ? all : all.filter((q) => q.theme === theme);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function PlayClient({ questions }: { questions: PlayQuestion[] }) {
  const [theme, setTheme] = useState<ThemeSlug | "MIXTE" | null>(null);
  const [round, setRound] = useState<PlayQuestion[]>([]);

  function start(selected: ThemeSlug | "MIXTE") {
    setTheme(selected);
    setRound(pickQuestions(questions, selected));
  }

  if (theme && round.length > 0) {
    return (
      <QuizGame
        theme={theme}
        questions={round}
        onComplete={async (payload) => {
          await saveGameResult({
            theme,
            score: payload.score,
            total: payload.total,
            duration_seconds: payload.duration_seconds,
            answers: payload.answers,
          });
        }}
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {THEMES.map((item, i) => (
        <button
          key={item.slug}
          type="button"
          onClick={() => start(item.slug)}
          className="animate-fade-up group rounded-2xl border border-white/10 bg-panel-sheen p-5 text-left transition hover:border-brand-amber/40"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <ThemeBadge theme={item.slug} />
          <h2 className="mt-4 font-display text-xl text-brand-mist group-hover:text-brand-amber">
            {item.label}
          </h2>
          <p className="mt-2 text-sm text-brand-mist/60">{item.description}</p>
        </button>
      ))}
      <button
        type="button"
        onClick={() => start("MIXTE")}
        className="animate-fade-up rounded-2xl border border-dashed border-brand-sand/40 bg-brand-ink/30 p-5 text-left transition hover:border-brand-amber/50 sm:col-span-2 lg:col-span-1"
      >
        <ThemeBadge theme="MIXTE" />
        <h2 className="mt-4 font-display text-xl text-brand-mist">Mission mixte</h2>
        <p className="mt-2 text-sm text-brand-mist/60">
          10 questions tirées de tous les thèmes.
        </p>
      </button>
    </div>
  );
}
