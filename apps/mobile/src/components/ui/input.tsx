import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    className={cn(
      "flex min-h-[74px] w-full rounded-[22px] border border-input bg-background px-5 py-4 text-[1.2rem] leading-8 text-foreground shadow-sm placeholder:text-muted-foreground file:border-0 file:bg-transparent file:text-base file:font-semibold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/25 disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    ref={ref}
    {...props}
  />
));

Input.displayName = "Input";

export { Input };
