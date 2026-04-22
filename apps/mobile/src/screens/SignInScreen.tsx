import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Card";
import { TextInput } from "@/components/Input";
import { ScreenShell } from "@/components/ScreenShell";
import { useSafetyApp } from "@/hooks/useSafetyApp";

export const SignInScreen = () => {
  const navigate = useNavigate();
  const { authStatus, authEmail, signInWithEmail, setDemoMode } = useSafetyApp();
  const [email, setEmail] = useState(authEmail);
  const [message, setMessage] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!email.trim()) {
      return;
    }

    setSubmitting(true);
    const response = await signInWithEmail(email.trim());
    setMessage(response.message);
    setSubmitting(false);
  };

  return (
    <ScreenShell
      title="Sign in safely"
      subtitle="Use a secure magic link so your trusted contacts and checks can sync across devices."
    >
      <Card>
        <CardHeader>
          <CardTitle>Email sign-in</CardTitle>
          <CardDescription className="text-[1.1rem]">
            Enter your email address. We will send a sign-in link. No password is required.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <TextInput
            type="email"
            inputMode="email"
            placeholder="Email address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Button size="lg" onClick={submit} disabled={submitting || !email.trim()}>
            {submitting ? "Sending link..." : "Send secure sign-in link"}
          </Button>
          {message ? <p className="text-[1rem] leading-7 text-muted-foreground">{message}</p> : null}
          {authStatus === "email_pending" ? (
            <p className="text-[1rem] leading-7 text-muted-foreground">
              We are waiting for you to open the link from your email inbox.
            </p>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Use demo mode</CardTitle>
          <CardDescription className="text-[1.1rem]">
            You can keep using the app locally on this device if you do not want to sign in yet.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            size="lg"
            variant="outline"
            onClick={() => {
              setDemoMode();
              navigate("/home");
            }}
          >
            Continue in demo mode
          </Button>
        </CardContent>
      </Card>
    </ScreenShell>
  );
};
