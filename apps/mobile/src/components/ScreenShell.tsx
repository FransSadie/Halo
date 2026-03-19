import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { Activity, Home, PhoneCall, Settings, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export const ScreenShell = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) => (
  <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col px-4 pb-8 pt-4 text-foreground sm:px-6">
    <header className="mb-6 overflow-hidden rounded-[36px] border border-border/70 bg-card/95 shadow-card backdrop-blur">
      <div className="bg-[linear-gradient(135deg,hsl(var(--accent)/0.95),hsl(var(--secondary)/0.95))] px-6 py-5 sm:px-7">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-card p-3 shadow-soft">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-primary">Senior Scam Safety</p>
            <p className="mt-1 text-base leading-7 text-muted-foreground">A calm check before you respond</p>
          </div>
        </div>
      </div>
      <div className="px-6 py-6 sm:px-7 sm:py-7">
        <h1 className="max-w-[16ch] text-[2.35rem] font-bold leading-[1.12] tracking-[-0.02em] sm:text-[2.65rem]">{title}</h1>
        {subtitle ? <p className="mt-4 max-w-[34ch] text-[1.2rem] leading-9 text-muted-foreground">{subtitle}</p> : null}
      </div>
    </header>

    <main className="flex-1 space-y-5">{children}</main>

    <nav className="sticky bottom-3 mt-8 rounded-[30px] border border-border/70 bg-card/95 p-2 shadow-card backdrop-blur">
      <div className="grid grid-cols-4 gap-2">
        {[
          { to: "/home", label: "Home", icon: Home },
          { to: "/contacts", label: "Contacts", icon: PhoneCall },
          { to: "/activity", label: "Activity", icon: Activity },
          { to: "/settings", label: "Settings", icon: Settings },
        ].map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex min-h-[72px] flex-col items-center justify-center rounded-[24px] px-2 text-[0.95rem] font-bold leading-5",
                isActive ? "bg-secondary text-secondary-foreground shadow-soft" : "text-muted-foreground",
              )
            }
          >
            <item.icon className="mb-1.5 h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </div>
      <Separator className="mt-2 opacity-0" />
    </nav>
  </div>
);
