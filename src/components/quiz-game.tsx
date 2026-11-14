"use client";

import { useMemo, useState, useTransition } from "react";
import { ThemeBadge } from "./theme-badge";
import type { Question, ThemeSlug } from "@/types";
import { cn } from "@/lib/utils";

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

const OPTIONS = ["A", "B", "C", "D"] as const;

export function QuizGame({
  theme,
  questions,
  onComplete,
}: {
  theme: ThemeSlug | "MIXTE";
  questions: PlayQuestion[];
  onComplete: (payload: {
    score: number;
    total: number;
    answers: {
      question_id: string;
      selected_answer: "A" | "B" | "C" | "D";
      is_correct: boolean;
    }[];
    duration_seconds: number;
  }) => Promise<void>;
}) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<"A" | "B" | "C" | "D" | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<
    {
      question_id: string;
      selected_answer: "A" | "B" | "C" | "D";
      is_correct: boolean;
    }[]
  >([]);
  const [startedAt] = useState(() => Date.now());
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();

  const current = questions[index];
  const progress = useMemo(
    () => ((index + (revealed ? 1 : 0)) / Math.max(questions.length, 1)) * 100,
    [index, revealed, questions.length]
  );

  if (!current) {
    return (
      <p className="text-brand-mist/70">
        Aucune question disponible pour ce thème. Importe le seed SQL.
      </p>
    );
  }

  const optionMap = {
    A: current.option_a,
    B: current.option_b,
    C: current.option_c,
    D: current.option_d,
  };

  function confirm() {
    if (!selected || !current) return;
    const isCorrect = selected === current.correct_answer;
    const nextAnswers = [
      ...answers,
      {
        question_id: current.id,
        selected_answer: selected,
        is_correct: isCorrect,
      },
    ];
    const nextScore = score + (isCorrect ? 1 : 0);
    setAnswers(nextAnswers);
    setScore(nextScore);
    setRevealed(true);

    if (index >= questions.length - 1) {
      setDone(true);
      startTransition(async () => {
        await onComplete({
          score: nextScore,
          total: questions.length,
          answers: nextAnswers,
          duration_seconds: Math.round((Date.now() - startedAt) / 1000),
        });
      });
    }
  }

  function next() {
    setIndex((i) => i + 1);
    setSelected(null);
    setRevealed(false);
  }

  if (done) {
    return (
      <div className="animate-fade-up rounded-2xl border border-white/10 bg-panel-sheen p-8 text-center">
        <ThemeBadge theme={theme} />
        <h2 className="mt-4 font-display text-3xl text-brand-mist">Mission terminée</h2>
        <p className="mt-3 text-brand-mist/70">
          Score : <span className="text-brand-amber">{score}</span> / {questions.length}
        </p>
        <p className="mt-1 text-sm text-brand-mist/50">
          {pending ? "Enregistrement…" : "Résultat enregistré."}
        </p>
        <a
          href="/play"
          className="mt-8 inline-flex rounded bg-brand-amber px-5 py-2.5 text-sm font-semibold text-brand-ink"
        >
          Nouvelle partie
        </a>
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <div className="mb-4 flex items-center justify-between gap-3">
        <ThemeBadge theme={current.theme} />
        <span className="text-sm text-brand-mist/55">
          {index + 1} / {questions.length}
        </span>
      </div>
      <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-brand-amber transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="rounded-2xl border border-white/10 bg-panel-sheen p-6 md:p-8">
        <h2 className="font-display text-xl text-brand-mist md:text-2xl">
          {current.question}
        </h2>
        <div className="mt-6 grid gap-3">
          {OPTIONS.map((letter) => {
            const isSelected = selected === letter;
            const isCorrect = letter === current.correct_answer;
            return (
              <button
                key={letter}
                type="button"
                disabled={revealed}
                onClick={() => setSelected(letter)}
                className={cn(
                  "rounded-xl border px-4 py-3 text-left text-sm transition",
                  !revealed &&
                    (isSelected
                      ? "border-brand-amber bg-brand-amber/15 text-brand-mist"
                      : "border-white/10 bg-brand-ink/40 text-brand-mist/85 hover:border-white/25"),
                  revealed &&
                    isCorrect &&
                    "border-brand-success/50 bg-brand-success/15 text-brand-mist",
                  revealed &&
                    isSelected &&
                    !isCorrect &&
                    "border-brand-danger/50 bg-brand-danger/15 text-brand-mist",
                  revealed &&
                    !isSelected &&
                    !isCorrect &&
                    "border-white/5 bg-brand-ink/20 text-brand-mist/45"
                )}
              >
                <span className="mr-2 font-semibold text-brand-amber">{letter}.</span>
                {optionMap[letter]}
              </button>
            );
          })}
        </div>

        {revealed && current.explanation && (
          <p className="mt-5 rounded-lg border border-white/10 bg-brand-ink/50 px-4 py-3 text-sm text-brand-mist/75">
            {current.explanation}
          </p>
        )}

        <div className="mt-6 flex justify-end">
          {!revealed ? (
            <button
              type="button"
              disabled={!selected}
              onClick={confirm}
              className="rounded bg-brand-amber px-5 py-2.5 text-sm font-semibold text-brand-ink disabled:opacity-40"
            >
              Valider
            </button>
          ) : (
            <button
              type="button"
              onClick={next}
              className="rounded bg-brand-amber px-5 py-2.5 text-sm font-semibold text-brand-ink"
            >
              Question suivante
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
