export function ConfigBanner() {
  return (
    <div className="mb-6 rounded border border-brand-amber/40 bg-brand-amber/10 px-4 py-3 text-sm text-brand-sand">
      Configure <code className="text-brand-amber">NEXT_PUBLIC_SUPABASE_URL</code>{" "}
      et <code className="text-brand-amber">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> dans{" "}
      <code className="text-brand-amber">.env.local</code>, puis exécute{" "}
      <code className="text-brand-amber">supabase/schema.sql</code> et{" "}
      <code className="text-brand-amber">seed.sql</code>.
    </div>
  );
}
