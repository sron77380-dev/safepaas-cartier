export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: "agent" | "manager" | "admin";
          avatar_url: string | null;
          site: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: "agent" | "manager" | "admin";
          avatar_url?: string | null;
          site?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          role?: "agent" | "manager" | "admin";
          avatar_url?: string | null;
          site?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      questions: {
        Row: {
          id: string;
          theme: "SSIAP" | "TFP" | "APS" | "SST" | "CARTIER";
          question: string;
          option_a: string;
          option_b: string;
          option_c: string;
          option_d: string;
          correct_answer: "A" | "B" | "C" | "D";
          explanation: string | null;
          difficulty: number;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          theme: "SSIAP" | "TFP" | "APS" | "SST" | "CARTIER";
          question: string;
          option_a: string;
          option_b: string;
          option_c: string;
          option_d: string;
          correct_answer: "A" | "B" | "C" | "D";
          explanation?: string | null;
          difficulty?: number;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          theme?: "SSIAP" | "TFP" | "APS" | "SST" | "CARTIER";
          question?: string;
          option_a?: string;
          option_b?: string;
          option_c?: string;
          option_d?: string;
          correct_answer?: "A" | "B" | "C" | "D";
          explanation?: string | null;
          difficulty?: number;
          active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      games: {
        Row: {
          id: string;
          user_id: string;
          theme: string;
          score: number;
          total_questions: number;
          duration_seconds: number | null;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          theme: string;
          score?: number;
          total_questions?: number;
          duration_seconds?: number | null;
          completed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          theme?: string;
          score?: number;
          total_questions?: number;
          duration_seconds?: number | null;
          completed_at?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "games_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      game_answers: {
        Row: {
          id: string;
          game_id: string;
          question_id: string;
          selected_answer: "A" | "B" | "C" | "D" | null;
          is_correct: boolean;
          time_spent_seconds: number | null;
        };
        Insert: {
          id?: string;
          game_id: string;
          question_id: string;
          selected_answer?: "A" | "B" | "C" | "D" | null;
          is_correct?: boolean;
          time_spent_seconds?: number | null;
        };
        Update: {
          id?: string;
          game_id?: string;
          question_id?: string;
          selected_answer?: "A" | "B" | "C" | "D" | null;
          is_correct?: boolean;
          time_spent_seconds?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "game_answers_game_id_fkey";
            columns: ["game_id"];
            isOneToOne: false;
            referencedRelation: "games";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "game_answers_question_id_fkey";
            columns: ["question_id"];
            isOneToOne: false;
            referencedRelation: "questions";
            referencedColumns: ["id"];
          },
        ];
      };
      badges: {
        Row: {
          id: string;
          user_id: string;
          badge_key: string;
          label: string;
          earned_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          badge_key: string;
          label: string;
          earned_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          badge_key?: string;
          label?: string;
          earned_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "badges_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      themes_stats: {
        Row: {
          id: string;
          user_id: string;
          theme: "SSIAP" | "TFP" | "APS" | "SST" | "CARTIER";
          games_played: number;
          correct_answers: number;
          total_answers: number;
          best_score: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          theme: "SSIAP" | "TFP" | "APS" | "SST" | "CARTIER";
          games_played?: number;
          correct_answers?: number;
          total_answers?: number;
          best_score?: number;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          theme?: "SSIAP" | "TFP" | "APS" | "SST" | "CARTIER";
          games_played?: number;
          correct_answers?: number;
          total_answers?: number;
          best_score?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "themes_stats_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      notifications: {
        Row: {
          id: string;
          title: string;
          body: string;
          created_by: string;
          audience: "all" | "agents" | "managers";
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          body: string;
          created_by: string;
          audience?: "all" | "agents" | "managers";
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          body?: string;
          created_by?: string;
          audience?: "all" | "agents" | "managers";
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      notification_reads: {
        Row: {
          id: string;
          notification_id: string;
          user_id: string;
          read_at: string;
        };
        Insert: {
          id?: string;
          notification_id: string;
          user_id: string;
          read_at?: string;
        };
        Update: {
          id?: string;
          notification_id?: string;
          user_id?: string;
          read_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notification_reads_notification_id_fkey";
            columns: ["notification_id"];
            isOneToOne: false;
            referencedRelation: "notifications";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notification_reads_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      current_role: {
        Args: Record<string, never>;
        Returns: "agent" | "manager" | "admin";
      };
    };
    Enums: {
      user_role: "agent" | "manager" | "admin";
      theme_slug: "SSIAP" | "TFP" | "APS" | "SST" | "CARTIER";
      answer_letter: "A" | "B" | "C" | "D";
      notification_audience: "all" | "agents" | "managers";
    };
    CompositeTypes: Record<string, never>;
  };
};
