export const dynamic = "force-dynamic";

import { AppShell } from "@/components/app-shell";
import { ConfigBanner } from "@/components/config-banner";
import { getSessionProfile } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createNotification, markNotificationRead } from "./actions";

export default async function NotificationsPage() {
  const { userId, profile, configured } = await getSessionProfile();
  const canSend =
    profile?.role === "manager" || profile?.role === "admin";

  let notifications: {
    id: string;
    title: string;
    body: string;
    audience: string;
    created_at: string;
  }[] = [];
  let readIds = new Set<string>();

  if (configured && userId) {
    const supabase = createServerSupabaseClient();
    const [notifRes, readsRes] = await Promise.all([
      supabase
        .from("notifications")
        .select("id, title, body, audience, created_at")
        .order("created_at", { ascending: false })
        .limit(30),
      supabase
        .from("notification_reads")
        .select("notification_id")
        .eq("user_id", userId),
    ]);
    notifications = notifRes.data ?? [];
    readIds = new Set((readsRes.data ?? []).map((r) => r.notification_id));
  }

  return (
    <AppShell
      profile={profile}
      title="Notifications"
      subtitle="Messages et consignes de l’équipe management."
    >
      {!configured && <ConfigBanner />}

      {canSend && (
        <form
          action={createNotification}
          className="mb-8 rounded-2xl border border-white/10 bg-panel-sheen p-6"
        >
          <h2 className="font-display text-xl text-brand-mist">Envoyer une alerte</h2>
          <div className="mt-4 grid gap-3">
            <input
              name="title"
              required
              placeholder="Titre"
              className="rounded border border-white/15 bg-brand-ink/60 px-3 py-2.5 text-sm outline-none ring-brand-amber/40 focus:ring-2"
            />
            <textarea
              name="body"
              required
              rows={3}
              placeholder="Message"
              className="rounded border border-white/15 bg-brand-ink/60 px-3 py-2.5 text-sm outline-none ring-brand-amber/40 focus:ring-2"
            />
            <select
              name="audience"
              className="rounded border border-white/15 bg-brand-ink/60 px-3 py-2.5 text-sm outline-none"
              defaultValue="all"
            >
              <option value="all">Tous</option>
              <option value="agents">Agents</option>
              <option value="managers">Managers</option>
            </select>
            <button
              type="submit"
              className="justify-self-start rounded bg-brand-amber px-4 py-2 text-sm font-semibold text-brand-ink"
            >
              Publier
            </button>
          </div>
        </form>
      )}

      <ul className="space-y-3">
        {notifications.length === 0 && (
          <li className="rounded-2xl border border-white/10 bg-panel-sheen p-6 text-sm text-brand-mist/55">
            Aucune notification pour le moment.
          </li>
        )}
        {notifications.map((notification) => {
          const isRead = readIds.has(notification.id);
          return (
            <li
              key={notification.id}
              className="rounded-2xl border border-white/10 bg-panel-sheen p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-medium text-brand-mist">{notification.title}</h3>
                  <p className="mt-2 text-sm text-brand-mist/70">{notification.body}</p>
                  <p className="mt-3 text-xs text-brand-mist/45">
                    {new Date(notification.created_at).toLocaleString("fr-FR", {
                      timeZone: "Europe/Paris",
                    })}{" "}
                    · {notification.audience}
                  </p>
                </div>
                {!isRead && (
                  <form action={markNotificationRead.bind(null, notification.id)}>
                    <button
                      type="submit"
                      className="rounded border border-white/15 px-3 py-1.5 text-xs text-brand-mist/70 hover:border-brand-amber/40 hover:text-brand-amber"
                    >
                      Marquer lu
                    </button>
                  </form>
                )}
                {isRead && (
                  <span className="text-xs text-brand-success">Lu</span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </AppShell>
  );
}
