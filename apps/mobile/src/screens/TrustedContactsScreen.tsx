import { useState } from "react";
import { MessageCircle, PhoneCall, Share2 } from "lucide-react";
import { Button } from "@/components/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Card";
import { ScreenShell } from "@/components/ScreenShell";
import { Badge } from "@/components/ui/badge";
import { useSafetyApp } from "@/hooks/useSafetyApp";
import { shareService } from "@/services/shareService";

export const TrustedContactsScreen = () => {
  const { trustedContacts, latestVerification } = useSafetyApp();
  const [sharedWith, setSharedWith] = useState<string | null>(null);
  const [shareStatus, setShareStatus] = useState<string>("Choose a contact to prepare a calm summary and next steps.");

  return (
    <ScreenShell title="Trusted contacts" subtitle="These are the people you can reach before you act.">
      {trustedContacts.map((contact) => (
        <Card key={contact.id}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle>{contact.name}</CardTitle>
                <CardDescription className="mt-2 text-[1.1rem]">{contact.relation}</CardDescription>
              </div>
              {contact.isPrimary ? <Badge variant="secondary">Primary</Badge> : null}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-[1.25rem] font-bold">{contact.phone}</p>

            <div className="grid grid-cols-2 gap-3">
              <Button asChild>
                <a href={`tel:${contact.phone}`}>
                  <PhoneCall className="h-5 w-5" />
                  Call
                </a>
              </Button>
              <Button asChild variant="secondary">
                <a href={`sms:${contact.phone}`}>
                  <MessageCircle className="h-5 w-5" />
                  Message
                </a>
              </Button>
            </div>

            <Button
              variant="outline"
              className="justify-start"
              onClick={async () => {
                const response = await shareService.shareToTrustedContact(contact, latestVerification);
                setSharedWith(contact.name);
                setShareStatus(
                  response.mode === "native"
                    ? `Shared securely with ${contact.name}.`
                    : response.mode === "clipboard"
                      ? `Copied a share summary for ${contact.name}.`
                      : `Opened a message draft for ${contact.name}.`,
                );
              }}
            >
              <Share2 className="h-5 w-5" />
              Share this suspicious item
            </Button>
          </CardContent>
        </Card>
      ))}

      <Card className="border-transparent bg-primary text-primary-foreground">
        <CardHeader className="pb-3">
          <CardTitle>Share workflow</CardTitle>
          <CardDescription className="text-[1.1rem] leading-8 text-primary-foreground/90">
            {sharedWith
              ? `Prepared a share summary for ${sharedWith}${latestVerification ? ` about "${latestVerification.request.sourceLabel}"` : ""}.`
              : shareStatus}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-[1rem] leading-7 text-primary-foreground/80">
            {shareStatus}
          </p>
        </CardContent>
      </Card>
    </ScreenShell>
  );
};
