import { createContext } from "react";
import type { ActivityEntry, SafetyReminder, TrustedContact, User, VerificationRequest, VerificationResult, VerificationType } from "@senior-scam-safety/core";
import { demoSeed } from "@senior-scam-safety/core";

export interface VerificationSession {
  request: VerificationRequest;
  result: VerificationResult;
}

export interface SafetyAppContextValue {
  user: User;
  reminders: SafetyReminder[];
  scenarios: typeof demoSeed.scenarios;
  trustedContacts: TrustedContact[];
  activity: ActivityEntry[];
  onboardingComplete: boolean;
  latestVerification: VerificationSession | null;
  completeOnboarding: (contacts: TrustedContact[]) => Promise<void>;
  evaluateInput: (type: VerificationType, sourceLabel: string, content: string, screenshotName?: string) => VerificationSession;
  setLatestVerification: (value: VerificationSession | null) => void;
}

export const SafetyAppContext = createContext<SafetyAppContextValue | null>(null);
