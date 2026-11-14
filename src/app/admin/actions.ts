"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non authentifié");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") throw new Error("Accès refusé");
  return supabase;
}

export async function createQuestion(formData: FormData) {
  const supabase = await requireAdmin();

  await supabase.from("questions").insert({
    theme: String(formData.get("theme")) as
      | "SSIAP"
      | "TFP"
      | "APS"
      | "SST"
      | "CARTIER",
    question: String(formData.get("question") ?? "").trim(),
    option_a: String(formData.get("option_a") ?? "").trim(),
    option_b: String(formData.get("option_b") ?? "").trim(),
    option_c: String(formData.get("option_c") ?? "").trim(),
    option_d: String(formData.get("option_d") ?? "").trim(),
    correct_answer: String(formData.get("correct_answer") ?? "A") as
      | "A"
      | "B"
      | "C"
      | "D",
    explanation: String(formData.get("explanation") ?? "").trim() || null,
    difficulty: Number(formData.get("difficulty") ?? 1),
    active: true,
  });

  revalidatePath("/admin");
}

export async function toggleQuestionActive(questionId: string, active: boolean) {
  const supabase = await requireAdmin();
  await supabase.from("questions").update({ active }).eq("id", questionId);
  revalidatePath("/admin");
}

export async function updateUserRole(formData: FormData) {
  const supabase = await requireAdmin();
  const userId = String(formData.get("user_id") ?? "");
  const role = String(formData.get("role") ?? "agent") as
    | "agent"
    | "manager"
    | "admin";

  if (!userId) return;

  await supabase.from("profiles").update({ role }).eq("id", userId);
  revalidatePath("/admin");
}
