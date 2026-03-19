import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Card";
import { TextArea } from "@/components/Input";
import { ScreenShell } from "@/components/ScreenShell";
import { useSafetyApp } from "@/hooks/useSafetyApp";

export const CheckTextScreen = () => {
  const navigate = useNavigate();
  const { evaluateInput, scenarios, accessibility } = useSafetyApp();
  const [message, setMessage] = useState("");

  const submit = async () => {
    if (!message.trim()) {
      return;
    }

    await evaluateInput("text", "Suspicious message", message);
    navigate("/result");
  };

  return (
    <ScreenShell
      title="Check a message"
      subtitle={accessibility.simplifiedMode ? "Paste the words here. Do not reply yet." : "Paste the message here. Do not click links while you decide."}
    >
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Step 1</CardTitle>
          <CardDescription className="text-[1.15rem]">Copy the words into the box below. You can also type a short description.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <TextArea
            placeholder="Paste the text message, email, or chat here."
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
          <Button size="lg" onClick={submit} disabled={!message.trim()}>
            Check this message
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Try a demo example</CardTitle>
          <CardDescription className="text-[1.1rem]">Use a sample message if you want to preview the flow quickly.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {scenarios
            .filter((scenario) => scenario.type === "text")
            .map((scenario) => (
              <Button key={scenario.id} className="justify-start" variant="outline" onClick={() => setMessage(scenario.content)}>
                {scenario.title}
              </Button>
            ))}
        </CardContent>
      </Card>
    </ScreenShell>
  );
};
