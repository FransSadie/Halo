import {
  demoSeed,
  evaluateVerification,
  type ActivityEntry,
  type TrustedContact,
  type VerificationRequest,
  type VerificationResult,
  type VerificationType,
} from "@senior-scam-safety/core";
import { useEffect, useState, type ReactNode } from "react";
import { SafetyAppContext, type SafetyAppContextValue } from "@/hooks/safetyAppContextValue";
import { appRepository, type AppStateSnapshot } from "@/services/appRepository";
import type { VerificationSession } from "@/hooks/safetyAppContextValue";

const createEntry = (request: VerificationRequest, result: VerificationResult): ActivityEntry => ({
  id: `activity-${crypto.randomUUID()}`,
  createdAt: request.createdAt,
  type: request.type,
  label: request.sourceLabel,
  outcome: result.riskLevel,
  summary: result.reasons[0] ?? result.explanation,
});

export const SafetyAppProvider = ({ children }: { children: ReactNode }) => {
  const loaded = appRepository.loadState();
  const [state, setState] = useState<AppStateSnapshot>(loaded);
  const [latestVerification, setLatestVerification] = useState<VerificationSession | null>(null);

  useEffect(() => {
    appRepository.saveState(state);
  }, [state]);

  const completeOnboarding = async (contacts: TrustedContact[]) => {
    const nextState = {
      ...state,
      trustedContacts: contacts,
      onboardingComplete: true,
    };
    setState(nextState);
    await appRepository.syncTrustedContacts(contacts);
  };

  const evaluateInput = (
    type: VerificationType,
    sourceLabel: string,
    content: string,
    screenshotName?: string,
  ) => {
    const request: VerificationRequest = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      type,
      sourceLabel,
      content,
      screenshotName,
    };
    const result = evaluateVerification(request);
    const session = { request, result };

    setState((current) => ({
      ...current,
      activity: [createEntry(request, result), ...current.activity].slice(0, 25),
    }));
    setLatestVerification(session);
    return session;
  };

  const value: SafetyAppContextValue = {
    user: state.user,
    reminders: demoSeed.reminders,
    scenarios: demoSeed.scenarios,
    trustedContacts: state.trustedContacts,
    activity: state.activity,
    onboardingComplete: state.onboardingComplete,
    latestVerification,
    completeOnboarding,
    evaluateInput,
    setLatestVerification,
  };

  return <SafetyAppContext.Provider value={value}>{children}</SafetyAppContext.Provider>;
};
