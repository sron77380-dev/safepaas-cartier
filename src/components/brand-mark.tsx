import { cn } from "@/lib/utils";

export function BrandMark({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-5xl md:text-7xl",
  };

  return (
    <div className={cn("font-display tracking-tight", sizes[size], className)}>
      <span className="text-brand-mist">Safe</span>
      <span className="text-brand-amber">Pass</span>
    </div>
  );
}
