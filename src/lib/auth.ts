import { createServerSupabaseClient, isSupabaseConfigured } from "./supabase/server";
import type { Profile } from "@/types";

export async function getSessionProfile(): Promise<{
  userId: string | null;
  profile: Profile | null;
  configured: boolean;
}> {
  if (!isSupabaseConfigured()) {
    return { userId: null, profile: null, configured: false };
  }

  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { userId: null, profile: null, configured: true };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return {
    userId: user.id,
    profile: (profile as Profile | null) ?? null,
    configured: true,
  };
}
