import React from "react";
import { cn } from "@/lib/cn";
import styles from "./StatusIndicator.module.css";

export type StatusValue =
  | "active" | "inactive" | "pending" | "sold" | "rented"
  | "new" | "hot" | "closed" | "lost" | "won" | "available";

export interface StatusIndicatorProps {
  status: StatusValue | string;
  label?: string;
  className?: string;
  size?: "sm" | "md";
}

const STATUS_MAP: Record<string, { dot: string; text: string }> = {
  active:    { dot: "success",  text: "Active" },
  available: { dot: "success",  text: "Available" },
  won:       { dot: "success",  text: "Won" },
  inactive:  { dot: "neutral",  text: "Inactive" },
  closed:    { dot: "neutral",  text: "Closed" },
  pending:   { dot: "warning",  text: "Pending" },
  new:       { dot: "info",     text: "New" },
  hot:       { dot: "danger",   text: "Hot" },
  sold:      { dot: "primary",  text: "Sold" },
  rented:    { dot: "primary",  text: "Rented" },
  lost:      { dot: "danger",   text: "Lost" },
};

function StatusIndicator({ status, label, className, size = "md" }: StatusIndicatorProps) {
  const config = STATUS_MAP[status.toLowerCase()] ?? { dot: "neutral", text: status };
  const displayLabel = label ?? config.text;

  return (
    <span className={cn(styles.wrapper, styles[size], className)}>
      <span className={cn(styles.dot, styles[`dot-${config.dot}`])} aria-hidden="true" />
      <span className={styles.label}>{displayLabel}</span>
    </span>
  );
}

export { StatusIndicator };
export default StatusIndicator;
