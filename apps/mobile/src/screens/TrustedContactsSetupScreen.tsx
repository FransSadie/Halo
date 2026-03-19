import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Card";
import { TextInput } from "@/components/Input";
import { ScreenShell } from "@/components/ScreenShell";
import { Label } from "@/components/ui/label";
import { useSafetyApp } from "@/hooks/useSafetyApp";
import type { TrustedContact } from "@senior-scam-safety/core";

const emptyContact = (index: number): TrustedContact => ({
  id: `draft-${index}`,
  name: "",
  relation: "",
  phone: "",
  email: "",
  preferredContactMethod: "call",
  isPrimary: index === 0,
});

export const TrustedContactsSetupScreen = () => {
  const navigate = useNavigate();
  const { trustedContacts, completeOnboarding } = useSafetyApp();
  const [contacts, setContacts] = useState<TrustedContact[]>(
    trustedContacts.length ? trustedContacts.slice(0, 3) : [emptyContact(0)],
  );
  const [saving, setSaving] = useState(false);

  const canAddMore = contacts.length < 3;
  const validContacts = useMemo(
    () => contacts.filter((contact) => contact.name.trim() && contact.phone.trim()),
    [contacts],
  );

  const updateContact = (id: string, patch: Partial<TrustedContact>) => {
    setContacts((current) => current.map((contact) => (contact.id === id ? { ...contact, ...patch } : contact)));
  };

  const save = async () => {
    if (validContacts.length === 0) {
      return;
    }

    setSaving(true);
    await completeOnboarding(
      validContacts.map((contact, index) => ({
        ...contact,
        id: contact.id.startsWith("draft-") ? crypto.randomUUID() : contact.id,
        isPrimary: index === 0,
      })),
    );
    setSaving(false);
    navigate("/home");
  };

  return (
    <ScreenShell
      title="Add trusted contacts"
      subtitle="Choose one to three people you can call before you send money, share codes, or click links."
    >
      <Card>
        <CardHeader>
          <CardTitle>Choose people you trust</CardTitle>
          <CardDescription className="text-[1.15rem]">
            Start with one person. You can add up to three. The first person will be your main contact.
          </CardDescription>
        </CardHeader>
      </Card>

      {contacts.map((contact, index) => (
        <Card key={contact.id}>
          <CardHeader className="pb-3">
            <CardTitle>Contact {index + 1}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <TextInput
                placeholder="Full name"
                value={contact.name}
                onChange={(event) => updateContact(contact.id, { name: event.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Relation</Label>
              <TextInput
                placeholder="Daughter, friend, caregiver"
                value={contact.relation}
                onChange={(event) => updateContact(contact.id, { relation: event.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Phone number</Label>
              <TextInput
                placeholder="Phone number"
                inputMode="tel"
                value={contact.phone}
                onChange={(event) => updateContact(contact.id, { phone: event.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Email (optional)</Label>
              <TextInput
                placeholder="Email"
                type="email"
                value={contact.email}
                onChange={(event) => updateContact(contact.id, { email: event.target.value })}
              />
            </div>
          </CardContent>
        </Card>
      ))}

      {canAddMore ? <Button size="lg" variant="secondary" onClick={() => setContacts((current) => [...current, emptyContact(current.length)])}>Add another contact</Button> : null}
      <Button size="lg" disabled={validContacts.length === 0 || saving} onClick={save}>
        {saving ? "Saving..." : "Finish setup"}
      </Button>
    </ScreenShell>
  );
};
