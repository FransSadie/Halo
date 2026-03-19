import { useContext } from "react";
import { SafetyAppContext } from "@/hooks/safetyAppContextValue";

export const useSafetyApp = () => {
  const context = useContext(SafetyAppContext);

  if (!context) {
    throw new Error("useSafetyApp must be used inside SafetyAppProvider");
  }

  return context;
};
