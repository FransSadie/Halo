import { createContext } from "react";
import type {
  AccessibilitySettings,
  ActivityEntry,
  SafetyReminder,
  TrustedContact,
  User,
  VerificationRequest,
  VerificationResult,
  VerificationType,
} from "@senior-scam-safety/core";
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
  accessibility: AccessibilitySettings;
  onboardingComplete: boolean;
  latestVerification: VerificationSession | null;
  authMode: "demo" | "supabase";
  authStatus: "anonymous" | "email_pending" | "signed_in";
  authEmail: string;
  completeOnboarding: (contacts: TrustedContact[]) => Promise<void>;
  evaluateInput: (
    type: VerificationType,
    sourceLabel: string,
    content: string,
    screenshotName?: string,
    extractedText?: string,
  ) => Promise<VerificationSession>;
  updateAccessibility: (settings: Partial<AccessibilitySettings>) => Promise<void>;
  signInWithEmail: (email: string) => Promise<{ ok: boolean; message: string }>;
  signOut: () => Promise<void>;
  setDemoMode: () => void;
  setLatestVerification: (value: VerificationSession | null) => void;
}

export const SafetyAppContext = createContext<SafetyAppContextValue | null>(null);
