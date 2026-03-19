import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Card";
import { TextArea, TextInput } from "@/components/Input";
import { ScreenShell } from "@/components/ScreenShell";
import { useSafetyApp } from "@/hooks/useSafetyApp";
import { ocrService } from "@/services/ocrService";

export const CheckScreenshotScreen = () => {
  const navigate = useNavigate();
  const { evaluateInput, scenarios } = useSafetyApp();
  const [fileName, setFileName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [ocrText, setOcrText] = useState("");
  const [ocrStatus, setOcrStatus] = useState("No OCR has been run yet.");
  const [reading, setReading] = useState(false);

  const runOcr = async () => {
    if (!selectedFile) {
      setOcrStatus("Choose a screenshot first.");
      return;
    }

    setReading(true);
    setOcrStatus("Reading the screenshot...");

    try {
      const text = await ocrService.extractText(selectedFile);
      setOcrText(text);
      if (!description.trim() && text) {
        setDescription(text);
      }
      setOcrStatus(text ? "We found text in the screenshot." : "No clear text was found in the screenshot.");
    } catch {
      setOcrStatus("The screenshot could not be read automatically.");
    } finally {
      setReading(false);
    }
  };

  const submit = async () => {
    if (!description.trim() && !ocrText.trim()) {
      return;
    }

    await evaluateInput(
      "screenshot",
      fileName || "Uploaded screenshot",
      description || "Screenshot submitted for review",
      fileName || undefined,
      ocrText || undefined,
    );
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
            onChange={(event) => {
              const file = event.target.files?.[0] ?? null;
              setSelectedFile(file);
              setFileName(file?.name ?? "");
              setOcrText("");
              setOcrStatus(file ? "Ready to read the screenshot." : "No OCR has been run yet.");
            }}
            className="file:mr-4 file:rounded-full file:bg-secondary file:px-4 file:py-2"
          />
          <Button size="lg" variant="secondary" onClick={runOcr} disabled={!selectedFile || reading}>
            {reading ? "Reading screenshot..." : "Read words from screenshot"}
          </Button>
          <p className="text-[1rem] leading-7 text-muted-foreground">{ocrStatus}</p>
          {ocrText ? (
            <div className="rounded-[24px] bg-muted px-4 py-4">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-muted-foreground">Extracted text</p>
              <p className="mt-3 text-[1rem] leading-7">{ocrText}</p>
            </div>
          ) : null}
          <TextArea
            placeholder="Describe the screenshot. For example: It says I won a prize and asks me to buy a gift card."
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <Button size="lg" onClick={submit} disabled={!description.trim() && !ocrText.trim()}>
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
                  setSelectedFile(null);
                  setDescription(scenario.content);
                  setOcrText("Congratulations. You won a prize. Buy a gift card today to release your reward.");
                  setOcrStatus("Demo OCR text loaded.");
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
