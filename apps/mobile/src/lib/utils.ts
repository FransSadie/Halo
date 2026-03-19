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
    return "border-red-200 bg-red-50 text-red-900";
  }

  if (risk === "suspicious") {
    return "border-amber-200 bg-amber-50 text-amber-900";
  }

  return "border-emerald-200 bg-emerald-50 text-emerald-900";
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
