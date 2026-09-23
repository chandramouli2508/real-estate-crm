"use client";

import React from "react";
import { cn } from "@/lib/cn";
import styles from "./Badge.module.css";

export type BadgeVariant = "default" | "success" | "warning" | "danger" | "info" | "neutral" | "primary" | "secondary";
export type BadgeSize = "sm" | "md";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
}

function Badge({
  variant = "default",
  size = "md",
  dot = false,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(styles.badge, styles[variant], styles[size], className)}
      {...props}
    >
      {dot && <span className={styles.dot} aria-hidden="true" />}
      {children}
    </span>
  );
}

export { Badge };
export default Badge;
