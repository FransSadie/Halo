import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Card";
import { TextInput } from "@/components/Input";
import { ScreenShell } from "@/components/ScreenShell";
import { useSafetyApp } from "@/hooks/useSafetyApp";

export const CheckPhoneScreen = () => {
  const navigate = useNavigate();
  const { evaluateInput, scenarios, trustedContacts } = useSafetyApp();
  const [phone, setPhone] = useState("");

  const submit = () => {
    if (!phone.trim()) {
      return;
    }

    const knownContact = trustedContacts.find((contact) => contact.phone === phone.trim());
    evaluateInput("phone", knownContact ? `${knownContact.name} phone number` : "Unknown phone number", phone);
    navigate("/result");
  };

  return (
    <ScreenShell title="Check a phone number" subtitle="Use this when a caller is unknown, unexpected, or asking for money or private details.">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Step 1</CardTitle>
          <CardDescription className="text-[1.15rem]">Enter the number you saw on the call or message.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <TextInput placeholder="Type the phone number" inputMode="tel" value={phone} onChange={(event) => setPhone(event.target.value)} />
          <Button size="lg" onClick={submit} disabled={!phone.trim()}>
            Check this number
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Demo example</CardTitle>
          <CardDescription className="text-[1.1rem]">Load a sample suspicious number to test the result screen.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {scenarios
            .filter((scenario) => scenario.type === "phone")
            .map((scenario) => (
              <Button key={scenario.id} className="justify-start" variant="outline" onClick={() => setPhone(scenario.content)}>
                {scenario.title}
              </Button>
            ))}
        </CardContent>
      </Card>
    </ScreenShell>
  );
};
