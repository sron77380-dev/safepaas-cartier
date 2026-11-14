export type UserRole = "agent" | "manager" | "admin";

export type ThemeSlug = "SSIAP" | "TFP" | "APS" | "SST" | "CARTIER";

export const THEMES: {
  slug: ThemeSlug;
  label: string;
  description: string;
  colorClass: string;
}[] = [
  {
    slug: "SSIAP",
    label: "SSIAP",
    description: "Sécurité incendie",
    colorClass: "bg-theme-ssiap",
  },
  {
    slug: "TFP",
    label: "TFP",
    description: "Technique formation professionnelle",
    colorClass: "bg-theme-tfp",
  },
  {
    slug: "APS",
    label: "APS",
    description: "Agent de prévention et de sécurité",
    colorClass: "bg-theme-aps",
  },
  {
    slug: "SST",
    label: "SST",
    description: "Sauveteur secouriste du travail",
    colorClass: "bg-theme-sst",
  },
  {
    slug: "CARTIER",
    label: "Cartier",
    description: "Spécifique Fondation Cartier",
    colorClass: "bg-theme-cartier",
  },
];

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  avatar_url: string | null;
  site: string | null;
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: string;
  theme: ThemeSlug;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: "A" | "B" | "C" | "D";
  explanation: string | null;
  difficulty: 1 | 2 | 3;
  active: boolean;
  created_at: string;
}

export interface Game {
  id: string;
  user_id: string;
  theme: ThemeSlug | "MIXTE";
  score: number;
  total_questions: number;
  duration_seconds: number | null;
  completed_at: string | null;
  created_at: string;
}

export interface GameAnswer {
  id: string;
  game_id: string;
  question_id: string;
  selected_answer: "A" | "B" | "C" | "D" | null;
  is_correct: boolean;
  time_spent_seconds: number | null;
}

export interface Badge {
  id: string;
  user_id: string;
  badge_key: string;
  label: string;
  earned_at: string;
}

export interface ThemeStat {
  id: string;
  user_id: string;
  theme: ThemeSlug;
  games_played: number;
  correct_answers: number;
  total_answers: number;
  best_score: number;
  updated_at: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  created_by: string;
  audience: "all" | "agents" | "managers";
  created_at: string;
}

export interface NotificationRead {
  id: string;
  notification_id: string;
  user_id: string;
  read_at: string;
}
