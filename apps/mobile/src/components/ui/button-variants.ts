import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-3 whitespace-normal rounded-[24px] text-left font-bold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/25 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-soft hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground shadow-soft hover:bg-secondary/90",
        outline: "border border-border bg-card text-card-foreground shadow-soft hover:bg-muted",
        ghost: "bg-transparent text-foreground hover:bg-muted",
        danger: "bg-danger text-danger-foreground shadow-soft hover:bg-danger/90",
      },
      size: {
        default: "min-h-[76px] px-6 py-5 text-[1.25rem] leading-8",
        lg: "min-h-[88px] px-7 py-6 text-[1.375rem] leading-8",
        sm: "min-h-[58px] px-5 py-3 text-lg leading-7",
        icon: "h-14 w-14 rounded-full",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      fullWidth: true,
    },
  },
);
