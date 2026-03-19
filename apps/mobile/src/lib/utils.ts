import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...values: Array<string | false | null | undefined>) => twMerge(clsx(values));

export const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("en-ZA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

export const riskTone = (risk: "likely_safe" | "suspicious" | "high_risk") => {
  if (risk === "high_risk") {
    return "border-red-400/40 bg-red-500/10 text-foreground";
  }

  if (risk === "suspicious") {
    return "border-amber-400/40 bg-amber-500/10 text-foreground";
  }

  return "border-emerald-400/40 bg-emerald-500/10 text-foreground";
};

export const riskLabel = (risk: "likely_safe" | "suspicious" | "high_risk") => {
  if (risk === "likely_safe") {
    return "Likely safe";
  }

  if (risk === "suspicious") {
    return "Suspicious";
  }

  return "High risk";
};
