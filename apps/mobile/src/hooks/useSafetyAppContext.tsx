import {
  demoSeed,
  evaluateVerification,
  type AccessibilitySettings,
  type ActivityEntry,
  type TrustedContact,
  type VerificationRequest,
  type VerificationResult,
  type VerificationType,
} from "@senior-scam-safety/core";
import { useEffect, useState, type ReactNode } from "react";
import { SafetyAppContext, type SafetyAppContextValue } from "@/hooks/safetyAppContextValue";
import { appRepository, type AppStateSnapshot } from "@/services/appRepository";
import { hasSupabaseConfig } from "@/services/supabaseClient";
import type { VerificationSession } from "@/hooks/safetyAppContextValue";

const createEntry = (request: VerificationRequest, result: VerificationResult): ActivityEntry => ({
  id: `activity-${request.id}`,
  createdAt: request.createdAt,
  type: request.type,
  label: request.sourceLabel,
  outcome: result.riskLevel,
  summary: result.reasons[0] ?? result.explanation,
});

const applyAccessibility = (settings: AccessibilitySettings) => {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.dataset.textScale = settings.textScale;
  document.documentElement.dataset.highContrast = settings.highContrast ? "true" : "false";
  document.documentElement.dataset.simplified = settings.simplifiedMode ? "true" : "false";
  document.documentElement.dataset.theme = settings.theme;
};

const mergeState = (current: AppStateSnapshot, incoming: Partial<AppStateSnapshot>): AppStateSnapshot => ({
  ...current,
  ...incoming,
  user: incoming.user ?? current.user,
  trustedContacts: incoming.trustedContacts ?? current.trustedContacts,
  activity: incoming.activity ?? current.activity,
  accessibility: incoming.accessibility ?? current.accessibility,
});

export const SafetyAppProvider = ({ children }: { children: ReactNode }) => {
  const loaded = appRepository.loadState();
  const [state, setState] = useState<AppStateSnapshot>(loaded);
  const [latestVerification, setLatestVerification] = useState<VerificationSession | null>(null);

  useEffect(() => {
    appRepository.saveState(state);
    applyAccessibility(state.accessibility);
  }, [state]);

  useEffect(() => {
    if (!hasSupabaseConfig) {
      return;
    }

    let cancelled = false;

    const hydrateSession = async () => {
      const session = await appRepository.getAuthSession();
      const authUser = session?.user;

      if (!authUser || cancelled) {
        return;
      }

      const remoteUser = {
        id: authUser.id,
        firstName: authUser.user_metadata.first_name ?? state.user.firstName,
        lastName: authUser.user_metadata.last_name ?? state.user.lastName,
        phone: state.user.phone,
        email: authUser.email ?? state.user.email,
        createdAt: authUser.created_at ?? state.user.createdAt,
      };

      await appRepository.ensureRemoteProfile(remoteUser);
      const remoteState = await appRepository.loadRemoteState(authUser.id);

      if (!cancelled) {
        setState((current) =>
          mergeState(current, {
            ...remoteState,
            user: remoteState?.user ?? remoteUser,
            authMode: "supabase",
            authStatus: "signed_in",
            authEmail: authUser.email ?? "",
          }),
        );
      }
    };

    void hydrateSession();

    const { data } = appRepository.onAuthStateChange(async (_event, session) => {
      const authUser = session?.user;

      if (!authUser) {
        setState((current) => ({
          ...current,
          authStatus: "anonymous",
          authMode: "demo",
          authEmail: "",
        }));
        return;
      }

      const remoteUser = {
        id: authUser.id,
        firstName: authUser.user_metadata.first_name ?? state.user.firstName,
        lastName: authUser.user_metadata.last_name ?? state.user.lastName,
        phone: state.user.phone,
        email: authUser.email ?? state.user.email,
        createdAt: authUser.created_at ?? state.user.createdAt,
      };

      await appRepository.ensureRemoteProfile(remoteUser);
      const remoteState = await appRepository.loadRemoteState(authUser.id);

      setState((current) =>
        mergeState(current, {
          ...remoteState,
          user: remoteState?.user ?? remoteUser,
          authMode: "supabase",
          authStatus: "signed_in",
          authEmail: authUser.email ?? "",
        }),
      );
    });

    return () => {
      cancelled = true;
      data.subscription.unsubscribe();
    };
  }, [state.user.createdAt, state.user.email, state.user.firstName, state.user.lastName, state.user.phone]);

  const completeOnboarding = async (contacts: TrustedContact[]) => {
    const nextState = {
      ...state,
      trustedContacts: contacts,
      onboardingComplete: true,
    };
    setState(nextState);

    if (state.authStatus === "signed_in") {
      await appRepository.syncTrustedContacts(state.user.id, contacts);
    }
  };

  const updateAccessibility = async (settings: Partial<AccessibilitySettings>) => {
    const nextAccessibility = {
      ...state.accessibility,
      ...settings,
    };

    setState((current) => ({
      ...current,
      accessibility: nextAccessibility,
    }));

    if (state.authStatus === "signed_in") {
      await appRepository.syncAccessibility(state.user.id, nextAccessibility);
    }
  };

  const evaluateInput = async (
    type: VerificationType,
    sourceLabel: string,
    content: string,
    screenshotName?: string,
    extractedText?: string,
  ) => {
    const request: VerificationRequest = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      type,
      sourceLabel,
      content,
      screenshotName,
      extractedText,
    };

    const evaluatorContent = extractedText?.trim() ? `${content}\n${extractedText}` : content;
    const result = evaluateVerification(
      {
        ...request,
        content: evaluatorContent,
      },
      {
        trustedContacts: state.trustedContacts,
      },
    );

    const session = { request, result };

    setState((current) => ({
      ...current,
      activity: [createEntry(request, result), ...current.activity].slice(0, 25),
    }));
    setLatestVerification(session);

    if (state.authStatus === "signed_in") {
      await appRepository.saveVerification(state.user.id, request, result);
    }

    return session;
  };

  const signInWithEmail = async (email: string) => {
    const response = await appRepository.signInWithEmail(email);

    if (response.ok) {
      setState((current) => ({
        ...current,
        authMode: "supabase",
        authStatus: "email_pending",
        authEmail: email,
      }));
    }

    return response;
  };

  const signOut = async () => {
    await appRepository.signOut();
    setState((current) => ({
      ...current,
      authMode: "demo",
      authStatus: "anonymous",
      authEmail: "",
    }));
  };

  const setDemoMode = () => {
    setState((current) => ({
      ...current,
      authMode: "demo",
      authStatus: "anonymous",
      authEmail: "",
    }));
  };

  const value: SafetyAppContextValue = {
    user: state.user,
    reminders: demoSeed.reminders,
    scenarios: demoSeed.scenarios,
    trustedContacts: state.trustedContacts,
    activity: state.activity,
    accessibility: state.accessibility,
    onboardingComplete: state.onboardingComplete,
    latestVerification,
    authMode: state.authMode,
    authStatus: state.authStatus,
    authEmail: state.authEmail,
    completeOnboarding,
    evaluateInput,
    updateAccessibility,
    signInWithEmail,
    signOut,
    setDemoMode,
    setLatestVerification,
  };

  return <SafetyAppContext.Provider value={value}>{children}</SafetyAppContext.Provider>;
};
