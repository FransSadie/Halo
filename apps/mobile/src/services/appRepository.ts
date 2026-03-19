import {
  demoSeed,
  type AccessibilitySettings,
  type ActivityEntry,
  type TrustedContact,
  type User,
  type VerificationRequest,
  type VerificationResult,
} from "@senior-scam-safety/core";
import type { Session } from "@supabase/supabase-js";
import { hasSupabaseConfig, supabase } from "./supabaseClient";
import { storage } from "./storage";

const STORAGE_KEY = "senior-scam-safety-state";

export interface AppStateSnapshot {
  user: User;
  trustedContacts: TrustedContact[];
  activity: ActivityEntry[];
  onboardingComplete: boolean;
  accessibility: AccessibilitySettings;
  authMode: "demo" | "supabase";
  authStatus: "anonymous" | "email_pending" | "signed_in";
  authEmail: string;
}

const fallbackState: AppStateSnapshot = {
  user: demoSeed.user,
  trustedContacts: demoSeed.trustedContacts,
  activity: demoSeed.activity,
  onboardingComplete: false,
  accessibility: demoSeed.accessibility,
  authMode: "demo",
  authStatus: "anonymous",
  authEmail: "",
};

const mapProfile = (profile: Record<string, unknown>): User => ({
  id: String(profile.id),
  firstName: String(profile.first_name ?? "Friend"),
  lastName: profile.last_name ? String(profile.last_name) : undefined,
  phone: profile.phone ? String(profile.phone) : undefined,
  email: profile.email ? String(profile.email) : undefined,
  createdAt: String(profile.created_at ?? new Date().toISOString()),
});

export const appRepository = {
  fallbackState,

  loadState() {
    const stored = storage.get<Partial<AppStateSnapshot>>(STORAGE_KEY, fallbackState);

    return {
      ...fallbackState,
      ...stored,
      user: {
        ...fallbackState.user,
        ...stored.user,
      },
      trustedContacts: stored.trustedContacts ?? fallbackState.trustedContacts,
      activity: stored.activity ?? fallbackState.activity,
      accessibility: {
        ...fallbackState.accessibility,
        ...stored.accessibility,
      },
      authMode: stored.authMode ?? fallbackState.authMode,
      authStatus: stored.authStatus ?? fallbackState.authStatus,
      authEmail: stored.authEmail ?? fallbackState.authEmail,
      onboardingComplete: stored.onboardingComplete ?? fallbackState.onboardingComplete,
    };
  },

  saveState(state: AppStateSnapshot) {
    storage.set(STORAGE_KEY, state);
  },

  async signInWithEmail(email: string) {
    if (!supabase) {
      return { ok: false, message: "Supabase is not configured yet." };
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: typeof window !== "undefined" ? `${window.location.origin}/home` : undefined,
      },
    });

    if (error) {
      return { ok: false, message: error.message };
    }

    return { ok: true, message: "Check your email for the secure sign-in link." };
  },

  async signOut() {
    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
  },

  async getAuthSession() {
    if (!supabase) {
      return null;
    }

    const { data } = await supabase.auth.getSession();
    return data.session;
  },

  onAuthStateChange(callback: (event: string, session: Session | null) => void | Promise<void>) {
    if (!supabase) {
      return { data: { subscription: { unsubscribe: () => undefined } } };
    }

    return supabase.auth.onAuthStateChange(callback);
  },

  async loadRemoteState(userId: string): Promise<Partial<AppStateSnapshot> | null> {
    if (!hasSupabaseConfig || !supabase) {
      return null;
    }

    const activeSupabase = supabase;
    if (!activeSupabase) {
      return null;
    }

    const [{ data: profile }, { data: contacts }, { data: settings }, { data: requests }] = await Promise.all([
      activeSupabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
      activeSupabase.from("trusted_contacts").select("*").eq("profile_id", userId).order("is_primary", { ascending: false }),
      activeSupabase.from("app_settings").select("*").eq("profile_id", userId).maybeSingle(),
      activeSupabase.from("verification_requests").select("*").eq("profile_id", userId).order("created_at", { ascending: false }).limit(25),
    ]);

    const requestRows = requests ?? [];
    const requestIds = requestRows.map((row) => row.id);
    const resultRows = requestIds.length
      ? (await activeSupabase.from("verification_results").select("*").in("request_id", requestIds)).data ?? []
      : [];

    const resultMap = new Map(resultRows.map((row) => [row.request_id, row]));

    return {
      user: profile ? mapProfile(profile) : undefined,
      trustedContacts:
        contacts?.map((contact) => ({
          id: String(contact.id),
          name: String(contact.name),
          relation: String(contact.relation),
          phone: String(contact.phone),
          email: contact.email ? String(contact.email) : undefined,
          preferredContactMethod: (contact.preferred_contact_method ?? "call") as TrustedContact["preferredContactMethod"],
          isPrimary: Boolean(contact.is_primary),
        })) ?? undefined,
      activity: requestRows.map((request) => {
        const result = resultMap.get(request.id);
        return {
          id: `activity-${request.id}`,
          createdAt: String(request.created_at),
          type: request.type as ActivityEntry["type"],
          label: String(request.source_label),
          outcome: (result?.risk_level ?? "suspicious") as ActivityEntry["outcome"],
          summary: String(result?.explanation ?? "Saved verification result."),
        };
      }),
      accessibility: settings
        ? {
            textScale: (settings.text_scale ?? "standard") as AccessibilitySettings["textScale"],
            highContrast: Boolean(settings.high_contrast),
            simplifiedMode: Boolean(settings.simplified_mode),
            readAloud: Boolean(settings.read_aloud),
            theme: (settings.theme ?? "light") as AccessibilitySettings["theme"],
          }
        : undefined,
      onboardingComplete: Boolean(contacts?.length),
      authMode: "supabase",
      authStatus: "signed_in",
      authEmail: profile?.email ? String(profile.email) : "",
    };
  },

  async ensureRemoteProfile(user: User) {
    if (!hasSupabaseConfig || !supabase) {
      return;
    }

    await supabase.from("profiles").upsert({
      id: user.id,
      first_name: user.firstName,
      last_name: user.lastName ?? null,
      phone: user.phone ?? null,
      email: user.email ?? null,
      created_at: user.createdAt,
    });
  },

  async syncTrustedContacts(userId: string, contacts: TrustedContact[]) {
    if (!hasSupabaseConfig || !supabase) {
      return { mode: "mock" as const, saved: contacts.length };
    }

    await supabase.from("trusted_contacts").delete().eq("profile_id", userId);
    await supabase.from("trusted_contacts").insert(
      contacts.map((contact) => ({
        id: contact.id,
        profile_id: userId,
        name: contact.name,
        relation: contact.relation,
        phone: contact.phone,
        email: contact.email ?? null,
        preferred_contact_method: contact.preferredContactMethod,
        is_primary: contact.isPrimary,
      })),
    );

    return { mode: "supabase" as const, saved: contacts.length };
  },

  async syncAccessibility(userId: string, settings: AccessibilitySettings) {
    if (!hasSupabaseConfig || !supabase) {
      return { mode: "mock" as const };
    }

    await supabase.from("app_settings").upsert({
      profile_id: userId,
      text_scale: settings.textScale,
      high_contrast: settings.highContrast,
      simplified_mode: settings.simplifiedMode,
      read_aloud: settings.readAloud,
      theme: settings.theme,
    });

    return { mode: "supabase" as const };
  },

  async saveVerification(userId: string, request: VerificationRequest, result: VerificationResult) {
    if (!hasSupabaseConfig || !supabase) {
      return { mode: "mock" as const };
    }

    await supabase.from("verification_requests").insert({
      id: request.id,
      profile_id: userId,
      type: request.type,
      source_label: request.sourceLabel,
      content: request.content,
      screenshot_name: request.screenshotName ?? null,
      extracted_text: request.extractedText ?? null,
      created_at: request.createdAt,
    });

    await supabase.from("verification_results").upsert({
      request_id: request.id,
      risk_level: result.riskLevel,
      score: result.score,
      explanation: result.explanation,
      suggested_action: result.suggestedAction,
      reasons: result.reasons,
      pause_checklist: result.pauseChecklist,
      requires_review: result.requiresReview,
      trusted_match_name: result.trustedMatchName ?? null,
    });

    return { mode: "supabase" as const };
  },
};
