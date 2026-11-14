import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatScore(score: number, total: number) {
  if (total === 0) return "0%";
  return `${Math.round((score / total) * 100)}%`;
}
