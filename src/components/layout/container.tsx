import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";
interface ContainerProps extends ComponentPropsWithoutRef<"div"> {
  as?: ElementType;
  children?: ReactNode;
}
export function Container({ as: Tag = "div", className, children, ...props }: ContainerProps) {
  return (
    <Tag className={cn("mx-auto w-full max-w-[1200px] px-6", className)} {...props}>
      {children}
    </Tag>
  );
}
