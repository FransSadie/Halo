import * as React from "react";
import { cn } from "@/lib/utils";

const Label = React.forwardRef<HTMLLabelElement, React.ComponentProps<"label">>(({ className, ...props }, ref) => (
  <label ref={ref} className={cn("text-lg font-bold leading-7 text-foreground", className)} {...props} />
));

Label.displayName = "Label";

export { Label };
