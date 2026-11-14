"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function markNotificationRead(notificationId: string) {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("notification_reads").upsert(
    {
      notification_id: notificationId,
      user_id: user.id,
    },
    { onConflict: "notification_id,user_id" }
  );

  revalidatePath("/notifications");
}

export async function createNotification(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const audience = String(formData.get("audience") ?? "all") as
    | "all"
    | "agents"
    | "managers";

  if (!title || !body) return;

  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || (profile.role !== "manager" && profile.role !== "admin")) {
    return;
  }

  await supabase.from("notifications").insert({
    title,
    body,
    created_by: user.id,
    audience,
  });

  revalidatePath("/notifications");
}
