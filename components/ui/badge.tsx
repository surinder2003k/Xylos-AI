import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-[11px] font-medium tracking-wide transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-[#36b7b0]/20 bg-[#36b7b0]/10 text-[#36b7b0]",
        outline:
          "border-white/10 bg-white/[0.03] text-[#8d8b85]",
        secondary:
          "border-white/10 bg-white/5 text-[#b8b4ac]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
