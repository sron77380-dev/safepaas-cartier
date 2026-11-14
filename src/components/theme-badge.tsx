import { cn } from "@/lib/utils";
import type { ThemeSlug } from "@/types";

const colors: Record<ThemeSlug | "MIXTE", string> = {
  SSIAP: "bg-theme-ssiap/20 text-theme-ssiap ring-theme-ssiap/30",
  TFP: "bg-theme-tfp/20 text-theme-tfp ring-theme-tfp/30",
  APS: "bg-theme-aps/20 text-theme-aps ring-theme-aps/30",
  SST: "bg-theme-sst/20 text-theme-sst ring-theme-sst/30",
  CARTIER: "bg-theme-cartier/20 text-theme-cartier ring-theme-cartier/30",
  MIXTE: "bg-brand-sand/20 text-brand-sand ring-brand-sand/30",
};

export function ThemeBadge({
  theme,
  className,
}: {
  theme: ThemeSlug | "MIXTE" | string;
  className?: string;
}) {
  const key = (theme in colors ? theme : "MIXTE") as ThemeSlug | "MIXTE";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        colors[key],
        className
      )}
    >
      {theme}
    </span>
  );
}
