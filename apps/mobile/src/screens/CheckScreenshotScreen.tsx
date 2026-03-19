import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Card";
import { TextArea, TextInput } from "@/components/Input";
import { ScreenShell } from "@/components/ScreenShell";
import { useSafetyApp } from "@/hooks/useSafetyApp";

export const CheckScreenshotScreen = () => {
  const navigate = useNavigate();
  const { evaluateInput, scenarios } = useSafetyApp();
  const [fileName, setFileName] = useState("");
  const [description, setDescription] = useState("");

  const submit = () => {
    if (!description.trim()) {
      return;
    }

    evaluateInput("screenshot", fileName || "Uploaded screenshot", description, fileName || undefined);
    navigate("/result");
  };

  return (
    <ScreenShell title="Check a screenshot" subtitle="Upload a screenshot or describe what it says. This version uses a safe placeholder flow.">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Step 1</CardTitle>
          <CardDescription className="text-[1.15rem]">If you have a screenshot, choose it below. Then describe what it is asking you to do.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <TextInput
            type="file"
            accept="image/*"
            onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "")}
            className="file:mr-4 file:rounded-full file:bg-secondary file:px-4 file:py-2"
          />
          <TextArea
            placeholder="Describe the screenshot. For example: It says I won a prize and asks me to buy a gift card."
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <Button size="lg" onClick={submit} disabled={!description.trim()}>
            Check this screenshot
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Demo example</CardTitle>
          <CardDescription className="text-[1.1rem]">Load a sample prize screenshot description to test the flow.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {scenarios
            .filter((scenario) => scenario.type === "screenshot")
            .map((scenario) => (
              <Button
                key={scenario.id}
                className="justify-start"
                variant="outline"
                onClick={() => {
                  setFileName("demo-prize-message.png");
                  setDescription(scenario.content);
                }}
              >
                {scenario.title}
              </Button>
            ))}
        </CardContent>
      </Card>
    </ScreenShell>
  );
};
