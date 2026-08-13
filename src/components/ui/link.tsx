import { cva, type VariantProps } from "class-variance-authority";
import NextLink from "next/link";
import * as React from "react";

import { cn } from "@/lib/utils";
const linkVariants = cva("", {
  variants: {
    variant: {
      underline:
        "text-foreground focus-visible:ring-ring hover:border-primary border-b border-(--w)/30 text-base font-semibold tracking-[0.02em] outline-none transition-colors focus-visible:ring-2",
      muted:
        "text-muted-foreground hover:text-foreground focus-visible:ring-ring mb-10 inline-block rounded-sm text-sm outline-none focus-visible:ring-2",
      outline:
        "text-foreground hover:ring-ring rounded-sm text-base font-semibold tracking-[0.02em] ring-1 hover:transition transition p-2",
    },
  },
});
function Link({
  className,
  variant,
  ...props
}: React.ComponentProps<typeof NextLink> & VariantProps<typeof linkVariants>) {
  return (
    <NextLink data-slot="link" className={cn(linkVariants({ variant, className }))} {...props} />
  );
}
export { Link, linkVariants };
