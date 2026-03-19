import { Navigate, Route, Routes } from "react-router-dom";
import { useSafetyApp } from "@/hooks/useSafetyApp";
import { SafetyAppProvider } from "@/hooks/useSafetyAppContext";
import { ActivityLogScreen } from "@/screens/ActivityLogScreen";
import { CheckPhoneScreen } from "@/screens/CheckPhoneScreen";
import { CheckScreenshotScreen } from "@/screens/CheckScreenshotScreen";
import { CheckTextScreen } from "@/screens/CheckTextScreen";
import { HomeScreen } from "@/screens/HomeScreen";
import { ResultScreen } from "@/screens/ResultScreen";
import { SettingsScreen } from "@/screens/SettingsScreen";
import { TrustedContactsScreen } from "@/screens/TrustedContactsScreen";
import { TrustedContactsSetupScreen } from "@/screens/TrustedContactsSetupScreen";
import { WelcomeScreen } from "@/screens/WelcomeScreen";

const AppRoutes = () => {
  const { onboardingComplete } = useSafetyApp();

  return (
    <Routes>
      <Route path="/" element={<Navigate to={onboardingComplete ? "/home" : "/welcome"} replace />} />
      <Route path="/welcome" element={<WelcomeScreen />} />
      <Route path="/onboarding/contacts" element={<TrustedContactsSetupScreen />} />
      <Route path="/home" element={<HomeScreen />} />
      <Route path="/check/text" element={<CheckTextScreen />} />
      <Route path="/check/phone" element={<CheckPhoneScreen />} />
      <Route path="/check/screenshot" element={<CheckScreenshotScreen />} />
      <Route path="/result" element={<ResultScreen />} />
      <Route path="/contacts" element={<TrustedContactsScreen />} />
      <Route path="/activity" element={<ActivityLogScreen />} />
      <Route path="/settings" element={<SettingsScreen />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => (
  <SafetyAppProvider>
    <AppRoutes />
  </SafetyAppProvider>
);

export default App;
